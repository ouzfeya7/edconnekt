const NotFound = () => {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">Oups ! Cette page n'existe pas.</p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Retour à l’accueil
        </a>
      </div>
    );
  };
  
  export default NotFound;
  