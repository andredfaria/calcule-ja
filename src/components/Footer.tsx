import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-grid">
        <div>
          <h3 className="footer-title">Gostou da ferramenta?</h3>
          <p className="footer-text">Ajude a manter o projeto no ar:</p>
          <p className="footer-highlight">PIX: 35991404064</p>
        </div>

        <div>
          <h3 className="footer-title">Sugestões e contato</h3>
          <form
            action="https://formsubmit.co/adfariacarvalho@gmail.com.com"
            method="POST"
            className="space-y-2"
          >
            <input type="text" name="name" required placeholder="Seu Nome" className="app-input" />
            <input type="email" name="email" required placeholder="Seu Email" className="app-input" />
            <textarea placeholder="Sua mensagem" className="app-input min-h-24" name="message" required />
            <button type="submit" className="app-button w-full">Enviar</button>
          </form>
        </div>

        <div>
          <h3 className="footer-title">Créditos</h3>
          <p className="footer-text">
            Desenvolvido por{' '}
            <a
              href="https://www.github.com/andredfaria"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              André de Faria Carvalho
            </a>
          </p>
          <p className="footer-text mt-2">© {new Date().getFullYear()} Calcule Já.</p>
        </div>
      </div>
    </footer>
  );
}
