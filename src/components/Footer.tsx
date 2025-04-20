const Footer = () => {
  return (
    <footer className="bg-black text-white min-h-14 md:h-[113px]">
      <div className="px-6 w-full h-full flex justify-center border-t border-gray-800">
        {/* <div className="hidden md:mx-auto md:grid md:max-w-10/12 grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p>4 Privet Drive,</p>
            <p>Little Whinging, Surrey</p>
            <p>GU34 7DT, United Kingdom</p>
            <p>Phone: (020) 7123 4567</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <p>Monday - Friday: 7am - 8pm</p>
            <p>Saturday: 8am - 4pm</p>
            <p>Sunday: Closed</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul>
              <li>Blood Tests</li>
              <li>COVID-19 Testing</li>
              <li>Genetic Testing</li>
              <li>Allergy Testing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400">
                LinkedIn
              </a>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col justify-center text-center px-4">
          <p>&copy; 2025 Medi-Lab. All rights reserved.</p>
          <p>
            Designed by{" "}
            <a href="http://github.com/alexoluwaseyi">Alex Oluwaseyi</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
