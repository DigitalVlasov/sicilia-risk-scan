/*
 * Quiz Sicurezza sul Lavoro - Compiled React Application
 * Version: 1.0.0
 * 
 * This file contains the compiled and minified React application
 * with all quiz logic, algorithms, and components preserved.
 * 
 * IMPORTANT: This is a placeholder for the actual compiled build.
 * To generate the real file, run: npm run build
 * Then copy the contents of dist/assets/*.js here
 */

console.log('Quiz Sicurezza Plugin loaded - Version 1.0.0');

// WordPress integration code
(function($) {
    'use strict';
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        const container = document.getElementById('quiz-sicurezza-root');
        if (container) {
            // This is where the React app will be mounted
            container.innerHTML = `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 400px; 
                    background: #f8fafc; 
                    border: 2px dashed #e5e7eb; 
                    border-radius: 8px; 
                    text-align: center; 
                    padding: 40px 20px;
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">🛠️</div>
                    <h3 style="color: #374151; margin-bottom: 10px;">Plugin in Configurazione</h3>
                    <p style="color: #6b7280; margin-bottom: 20px; max-width: 500px;">
                        Per completare l'installazione, è necessario compilare l'app React.<br>
                        Segui le istruzioni nella documentazione per generare i file di build.
                    </p>
                    <div style="background: #fef3c7; color: #92400e; padding: 10px 15px; border-radius: 6px; font-size: 14px;">
                        <strong>Prossimo passo:</strong> Esegui <code>npm run build</code> e copia i file in assets/
                    </div>
                </div>
            `;
            
            console.log('Quiz Sicurezza container found and initialized');
        }
    });
    
    // AJAX integration for saving quiz results
    window.saveQuizResult = function(data) {
        if (typeof quizAjax === 'undefined') {
            console.error('Quiz AJAX not properly configured');
            return;
        }
        
        $.ajax({
            url: quizAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_quiz_result',
                nonce: quizAjax.nonce,
                ...data
            },
            success: function(response) {
                console.log('Quiz result saved successfully', response);
            },
            error: function(xhr, status, error) {
                console.error('Error saving quiz result:', error);
            }
        });
    };
    
})(jQuery);

/*
 * BUILD INSTRUCTIONS:
 * 
 * 1. Navigate to your React project directory
 * 2. Run: npm run build
 * 3. Copy the content of dist/assets/index-[hash].js
 * 4. Replace this entire file with the compiled content
 * 5. Ensure the React app mounts to #quiz-sicurezza-root
 * 6. Integrate saveQuizResult() calls in your React components
 * 
 * The compiled app should:
 * - Mount to document.getElementById('quiz-sicurezza-root')
 * - Call window.saveQuizResult(data) when quiz is completed
 * - Preserve all existing algorithms and logic
 * - Be self-contained with no external dependencies
 */