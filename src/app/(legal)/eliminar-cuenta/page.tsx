export default function EliminarCuenta() {
  return (
    <div style={{ background: "#1A1A1A", color: "white", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        .legal-container { max-width: 1140px; margin: auto; padding: 0 16px 50px; }
        .legal-container h1 { color: #D4FF00; text-align: center; }
        .legal-container h3 { color: #D4FF00; }
        .legal-container a { color: #D4FF00; }
        .alert-box { padding: 16px; border-radius: 8px; background: #1e3a5f; border: 1px solid #2a5a9f; color: #90caf9; margin-bottom: 16px; }
        .mb-list { padding-left: 24px; line-height: 2; }
        @media (max-width: 768px) { .legal-container { padding: 25px 25px 25px; } }
      `}</style>

      <div className="legal-container">
        <div style={{ textAlign: "center" }}>
          <img src="/Logo.svg" style={{ margin: "40px 0" }} width="280" alt="Timshel Logo" />
        </div>

        <h1>Eliminar cuenta</h1>

        <div>
          <h3>Eliminar cuenta en Timshel</h3>

          <div className="alert-box">
            Al eliminar una cuenta de Timshel, estas son las consideraciones que debes tener en cuenta:
          </div>

          <ul className="mb-list">
            <li>Todos tus datos e imágenes serán borradas permanentemente.</li>
            <li>Tus órdenes y favoritos se eliminarán permanentemente.</li>
            <li>Si tienes un negocio activo, todos tus datos, imágenes, y productos del negocio serán eliminados.</li>
          </ul>

          <h3>
            Esta función estará próximamente. Mientras tanto comunícate al correo{" "}
            <a href="mailto:tavocreativo@gmail.com">tavocreativo@gmail.com</a>
          </h3>
        </div>
      </div>
    </div>
  );
}
