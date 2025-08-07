export const Footer = () => {
  return (
    <footer className="mt-16 w-full border-t bg-foreground text-background">
      <div className="container mx-auto flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Spazio Impresa</div>
        <div className="opacity-80">Contatti: info@spazio-impresa.it · P.IVA 00000000000</div>
      </div>
    </footer>
  );
};
