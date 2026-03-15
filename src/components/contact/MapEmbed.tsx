export default function MapEmbed() {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800">
      <iframe
        title="Rockstar Windshield Repair Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d209730.29885498995!2d-92.4445!3d34.7465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a134a11f569b%3A0x3405f5100df35b17!2sLittle%20Rock%2C%20AR!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
