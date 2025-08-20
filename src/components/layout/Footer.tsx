export const Footer = () => {
  return (
    <footer className="mt-16 w-full border-t border-glow bg-gradient-tech backdrop-blur-md">
      <div className="container mx-auto flex flex-col gap-2 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-neon font-semibold">© {new Date().getFullYear()} Spazio Impresa</div>
        <div className="text-muted-foreground">Contatti: info@spazio-impresa.it · P.IVA 00000000000</div>
      </div>
    </footer>
  );
};
