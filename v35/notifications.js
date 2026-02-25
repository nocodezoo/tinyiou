/**
 * TinyIOU Notification System
 * Lives: /home/ryant/tinyiou_Ph2/tinyiou.com/notifications.js
 * 
 * Provides real-time notifications for:
 * 1. Chat messages received for current user's handle
 * 2. IOU mentions where current user's handle appears as recipient
 * 
 * Usage: Add to any TinyIOU page for instant notifications
 */

class TinyOuiNotificationSystem {
    constructor() {
        this.supabaseUrl = 'https://cijsxlylkanxmzkteabg.supabase.co';
        this.supabaseKey = 'sb_publishable_cOcjpEDxsX7EH-5cm0ByxA_OqbizsX4';
        this.client = null;
        this.userProfile = null;
        this.userSession = null;
        this.subscriptions = [];
        this.notificationSound = null;
        this.notificationContainer = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Supabase client (reuse existing one if already loaded)
            if (window.supabase?.createClient) {
                this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
            } else {
                // Create new client
                this.client = window.supabase?.createClient ? 
                    window.supabase.createClient(this.supabaseUrl, this.supabaseKey) : null;
            }

            if (!this.client) {
                console.warn('TinyOui Notifications: Supabase not available');
                return;
            }

            await this.loadUserSession();
            await this.loadUserProfile();
            this.setupAudio();
            this.createNotificationContainer();
            this.subscribeToNotifications();
            this.requestBrowserPermissions();
            
            console.log('📱 TinyOui Notification System: Active');
        } catch (error) {
            console.error('TinyOui Notifications: Failed to initialize:', error);
        }
    }

    async loadUserSession() {
        try {
            const { data, error } = await this.client.auth.getSession();
            if (error) {
                console.warn('TinyOui Notifications: No session available');
                return false;
            }
            
            this.userSession = data?.session;
            return !!this.userSession;
        } catch (error) {
            console.error('TinyOui Notifications: Session load error:', error);
            return false;
        }
    }

    async loadUserProfile() {
        if (!this.userSession?.user?.id) return false;

        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('username, full_name, id')
                .eq('id', this.userSession.user.id)
                .single();

            if (error) {
                console.warn('TinyOui Notifications: Profile load error:', error);
                return false;
            }

            this.userProfile = data;
            return true;
        } catch (error) {
            console.error('TinyOui Notifications: Profile fetch error:', error);
            return false;
        }
    }

    setupAudio() {
        try {
            // Create notification sound - brief chime effect
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            this.notificationSound = () => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.frequency.value = 800; // Brief chime
                osc.type = 'sine';
                
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            };
        } catch (error) {
            console.warn('TinyOui Notifications: Audio setup failed:', error);
        }
    }

    createNotificationContainer() {
        // Create fixed notification overlay
        const container = document.createElement('div');
        container.id = 'tinyoui-notifications';
        container.className = 'fixed top-6 right-6 z-[9999] w-full max-w-sm space-y-3 pointer-events-none';
        container.style.cssText = `
            position: fixed;
            top: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            width: 100%;
            max-width: 400px;
            pointer-events: none;
        `;

        document.body.appendChild(container);
        this.notificationContainer = container;
    }

    async subscribeToNotifications() {
        if (!this.userProfile?.username || !this.client) return;

        console.log(`🔔 Subscribing to notifications for @${this.userProfile.username}`);

        // Subscribe to chat messages targeting current user
        await this.subscribeToChatMessages();
        
        // Subscribe to IOUs where current user is recipient
        await this.subscribeToIOUMentions();
    }

    async subscribeToChatMessages() {
        const channel = this.client
            .channel('tinyoui-chat-messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${this.userSession.user.id}`
            }, async (payload) => {
                console.log('💬 New chat message received:', payload.new);
                await this.handleChatMessage(payload.new);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Subscribed to chat messages');
                }
            });

        this.subscriptions.push(channel);
    }

    async subscribeToIOUMentions() {
        const channel = this.client
            .channel('tinyoui-iou-mentions')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ious',
                filter: `receiver_id=eq.${this.userSession.user.id}`
            }, async (payload) => {
                console.log('📄 New IOU mentioning you:', payload.new);
                await this.handleIOUMention(payload.new);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Subscribed to IOU mentions');
                }
            });

        this.subscriptions.push(channel);
    }

    async handleChatMessage(message) {
        try {
            // Get sender info for better notification
            const { data: sender } = await this.client
                .from('profiles')
                .select('username, full_name')
                .eq('id', message.sender_id)
                .single();

            const messagePreview = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
            const title = `Message from @${sender?.username || 'TinyOui User'}`;
            
            this.showNotification({
                type: 'chat',
                title,
                message: messagePreview,
                action: {
                    text: 'Reply',
                    callback: () => this.navigateToChat(sender?.username)
                },
                sender: sender,
                originalMessage: message
            });

        } catch (error) {
            console.error('TinyOui Notifications: Error handling chat message:', error);
        }
    }

    async handleIOUMention(iou) {
        try {
            // Get creator info for better notification
            const { data: creator } = await this.client
                .from('profiles')
                .select('username, full_name')
                .eq('id', iou.creator_id)
                .single();

            // Parse taxonomy and narrative
            let narrative = iou.narrative;
            if (narrative.includes(' | ')) {
                const parts = narrative.split(' | ');
                narrative = parts.slice(1).join(' | ');
            }

            const title = `IOU from @${creator?.username || 'Anon'}`;
            const message = narrative.substring(0, 70) + (narrative.length > 70 ? '...' : '');

            this.showNotification({
                type: 'iou',
                title,
                message,
                action: {
                    text: 'View IOU',
                    callback: () => this.navigateToProfile(creator?.username)
                },
                creator: creator,
                originalIoU: iou
            });

        } catch (error) {
            console.error('TinyOui Notifications: Error handling IOU mention:', error);
        }
    }

    showNotification({ type, title, message, action, ...data }) {
        try {
            const notification = this.createNotificationElement(type, title, message, action, data);
            this.notificationContainer.appendChild(notification);

            // Audio cue
            if (this.notificationSound) {
                this.notificationSound();
            }

            // Browser notification (auto-close after timeout since it's external)
            this.showBrowserNotification(title, message, action, data);

            // NOTE: No auto-dismiss for main toast notifications - require user interaction

        } catch (error) {
            console.error('TinyOui Notifications: Error showing notification:', error);
        }
    }

    createNotificationElement(type, title, message, action, data) {
        const el = document.createElement('div');
        el.className = 'notification-enter bg-white/95 rounded-xl p-4 shadow-xl border border-orange-100 max-w-sm pointer-events-auto';
        el.style.cssText = 'transition: all 0.3s ease; margin-bottom: 0.5rem;';

        const icon = type === 'chat' ? 'ph-chat-teardrop' : 'ph-heart';
        const colorClass = type === 'chat' ? 'bg-green-500' : 'bg-orange-500';

        el.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-3 h-3 ${colorClass} rounded-full mt-1.5 flex-shrink-0 animate-pulse"></div>
                <div class="flex-1">
                    <h4 class="font-black text-sm text-gray-900">${title}</h4>
                    <p class="text-xs text-gray-600 mt-1">${message}</p>
                    ${action ? `
                        <div class="flex items-center gap-3 mt-2">
                            <button onclick="this.closest('.notification-enter').remove()" 
                                    class="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-orange-600 transition-colors cursor-pointer bg-transparent border-none">
                                Close
                            </button>
                            <button onclick="${action.callback}(); this.closest('.notification-enter').remove();" 
                                    class="text-[10px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors cursor-pointer bg-transparent border-none">
                                ${action.text}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return el;
    }

    showBrowserNotification(title, message, action, data) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: 'https://via.placeholder.com/64/f97316/white?text=i',
                badge: 'https://via.placeholder.com/32/f97316/white?text=i'
            });

            if (action && action.callback) {
                notification.onclick = action.callback;
            }

            setTimeout(() => notification.close(), 5000);
        }
    }

    navigateToChat(username) {
        if (window.parent !== window) {
            // In iframe context
            window.parent.location.href = 
                `${window.location.origin}/chat.html?target=${username}`;
        } else {
            window.location.href = `${window.location.origin}/chat.html?target=${username}`;
        }
    }

    navigateToProfile(username) {
        if (window.parent !== window) {
            window.parent.location.href = 
                `${window.location.origin}/?u=${username}`;
        } else {
            window.location.href = `${window.location.origin}/?u=${username}`;
        }
    }

    async requestBrowserPermissions() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                await Notification.requestPermission();
            } catch (error) {
                console.warn('TinyOui Notifications: Browser permission denied');
            }
        }
    }

    destroy() {
        this.subscriptions.forEach(channel => {
            this.client?.removeChannel(channel);
        });
        
        const container = document.getElementById('tinyoui-notifications');
        container?.remove();
        
        console.log('📴 TinyOui Notification System: Stopped');
    }
}

// Auto-initialize when TinyOui notification system is loaded
(function() {
    // Wait for DOM to be ready and TinyOui context
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNotifications);
    } else {
        initializeNotifications();
    }
    
    function initializeNotifications() {
        // Check if we're in a TinyOui context
        if (window.location.hostname.includes('tinyiou') || window.location.pathname.includes('tinyiou')) {
            try {
                window.TinyOuiNotifications = new TinyOuiNotificationSystem();
                
                // Expose method to refresh notifications
                window.refreshTinyOuiNotifications = () => {
                    if (window.TinyOuiNotifications) {
                        window.TinyOuiNotifications.destroy();
                        window.TinyOuiNotifications = new TinyOuiNotificationSystem();
                    }
                };
                
                console.log('🎯 TinyOui Notifications: Ready');
            } catch (error) {
                console.error('TinyOui Notifications: Initialization failed:', error);
            }
        }
    }
})();