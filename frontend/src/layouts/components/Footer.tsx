export function Footer() {
  return (
    <footer className='border-t border-border py-4 bg-muted/40'>
      <div className='container mx-auto px-4 text-center text-xs text-muted-foreground'>
        &copy; {new Date().getFullYear()} PM Theo Dõi Than. All rights reserved.
      </div>
    </footer>
  );
}
