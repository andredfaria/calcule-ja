import React from 'react';

export default function Footer() {
  return (
    <footer className="text-black py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="self-end">
            <h3 className=" place-items-end text-lg font-semibold text-black mb-4">
              Te ajudou em algo !?
            </h3>
            <ul className="space-y-2">
              <li>Ajude o desenvolvedor!</li>
              <li>PIX: 35991404064</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg text-center font-semibold text-black mb-4">
              Sugestões e Contato
            </h3>
            <form
              action="https://formsubmit.co/adfariacarvalho@gmail.com.com"
              method="POST"
              className="max-w-md mx-auto p-2 space-y-2"
            >
              <input
                type="text"
                name="name"
                required
                placeholder="Seu Nome"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Seu Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Sua mensagem"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="message"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Enviar
              </button>
            </form>
          </div>
          <div className="self-end justify-self-end">
            <h3 className="text-lg text-right font-semibold text-black mb-4">
              Calcule Ja
            </h3>
            <p>
              Desenvolvido por{" "}
              <a
                href="https://www.github.com/andredfaria"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                André de Faria Carvalho
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Calcule Ja. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
