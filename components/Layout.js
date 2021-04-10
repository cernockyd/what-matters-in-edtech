export default function Layout({ children }) {
  return (
    <>
      <div className="wrapper">{children}</div>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex: 1 1;
        }
      `}</style>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }

        :root {
          --site-color: royalblue;
          --divider-color: rgba(0, 0, 0, 0.4);
          --color-brand: red;
        }

        html {
          font: 100%/1.5 system-ui;
        }

        a {
          color: var(--color-brand);
          text-decoration-thickness: 2px;
        }

        a:hover {
          color: var(--site-color);
          text-decoration-color: currentcolor;
        }

        h1,
        p {
          margin-bottom: 1.5rem;
        }

        p {
          font-size: 20px;
        }

        code {
          font-family: 'Menlo';
        }
      `}</style>
    </>
  )
}
