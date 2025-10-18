import EnquiryButton from './EnquiryForm';
import WhatsAppWidget from './WhatsAppWidget';

const PublicLayout = ({ children }) => {
  return (
    <>
      {children}
      <EnquiryButton />
      <WhatsAppWidget />
    </>
  );
};

export default PublicLayout;