export default function Footer() {
  return (
    <footer className="flex align-bottom px-4 text-white">
      <div className="flex-1 p-2">
        <p className="text-black">
          Calcule ja.
          <br />
          Todos os direitos reservados. © {new Date().getFullYear()}
        </p>
      </div>
      <div className="flex-1 p-2">
        <p className="text-black">
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
      <div className="flex-1 p-2">
        <p className="text-black">
          Foi útil pra você?
          <br />
          <br />
          <span className="font-semibold">Ajude o desenvolvedor!</span>
          <br />
          <span className="text-gray-700 block md:inline mt-1">
            PIX: <span className="font-mono">35991404064</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
