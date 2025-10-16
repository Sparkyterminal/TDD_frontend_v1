import WhatsAppWidget from './WhatsAppWidget';

const PublicLayout = ({ children }) => {
  return (
    <>
      {children}
      <WhatsAppWidget />
    </>
  );
};

export default PublicLayout;