// @handle autocomplete - Field-triggered version
// 2.js - Added field-triggered user selection

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 TinyIOU @Handle Autocomplete - 2.js loaded');
    
    const availableHandles = ['alice', 'bob', 'charlie', 'dave', 'evi', 'frank', 'grace', 'henry', 'irene', 'james'];
    
    // Enhanced field detection - targets actual TinyIOU components
    function setupHandleAutocomplete() {
        const inputs = document.querySelectorAll(
            'input[placeholder*="@"], ' +
            'input[placeholder*="handle"], ' +
            'input[type="text"], ' +
            '.input-premium'
        );
        
        inputs.forEach(input => {
            if (!input.dataset.autocompleteEnabled) {
                input.dataset.autocompleteEnabled = 'true';
                
                // Main trigger - click on @handle field
                input.addEventListener('click', function() {
                    showHandleModal(this);
                });
            }
        });

        // Monitor for new inputs (React components)
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                const newInputs = document.querySelectorAll(
                    'input:not([data-autocomplete-enabled]), ' +
                    'div[contenteditable="true"]'
                );
                newInputs.forEach(input => {
                    if (input.dataset.autocompleteEnabled !== 'true') {
                        input.dataset.autocompleteEnabled = 'true';
                        
                        input.addEventListener('click', function() {
                            if (this.placeholder && this.placeholder.includes('@')) {
                                showHandleModal(this);
                            }
                        });
                    }
                });
            }, 100);
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showHandleModal(input) {
        const existing = document.getElementById('tinyioiu-handle-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'tinyioiu-handle-modal';
        modal.className = 'fixed z-100000';
        modal.style.cssText = 'position: absolute; z-index: 100000; background: white; border: 2px solid #f97316; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); min-width: 200px; max-height: 300px; overflow-y: auto;';

        const rect = input.getBoundingClientRect();
        modal.style.left = rect.left + 'px';
        modal.style.top = (rect.bottom + 2) + 'px';
        modal.style.minWidth = Math.max(rect.width, 160) + 'px';
        
        modal.innerHTML = `
            <div style="padding: 8px 12px; font-weight: bold; color: #f97316; margin-bottom: 4px;">Available @handles:</div>
            ${availableHandles.map(handle => `
                <div style="padding: 6px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; border-bottom: 1px solid #f7f9f9;" 
                     onmouseover="this.style.background='#fff7ed'; this.style.borderLeft='4px solid #f97316';" 
                     onmouseout="this.style.background='white'; this.style.borderLeft='none';"
                     onclick="selectHandle('${handle}', this.parentElement.parentElement)">
                    <div style="width: 20px; height: 20px; background: #f97316; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${handle[0].toUpperCase()}</div>
                    <div style="font-weight: bold; color: #f97316;">@${handle}</div>
                </div>
            `).join('')}
        `;
        
        document.body.appendChild(modal);

        // Handle selection
        window.selectHandle = function(handle, modal) {
            const inputs = document.querySelectorAll(
                'input[placeholder*="@"], ' +
                'input[placeholder*="handle"], ' +
                'input[type="text"]'
            );
            
            inputs.forEach(input => {
                if (input === modal._originalInput) {
                    input.value = handle;
                    input.focus();
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            
            if (modal) {
                modal._originalInput = input;
            }
            
            modal.remove();
        };

        // Close when clicking outside
        setTimeout(() => {
            let closeHandle = function(e) {
                if (modal && !modal.contains(e.target) && e.target !== input) {
                    modal.remove();
                    document.removeEventListener('click', closeHandle);
                }
            };
            document.addEventListener('click', closeHandle);
        }, 100);

        modal._originalInput = input;
    }

    // Initialize
    setupHandleAutocomplete();
    setTimeout(() => setupHandleAutocomplete(), 500);
    setTimeout(() => setupHandleAutocomplete(), 1500);
    
    console.log('✅ 2.js - @Handle autocomplete ready - click any "@handle" field to see available users!');
});