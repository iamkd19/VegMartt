import './Footer.css';
function Footer(){
    return(
        <footer className="footer">
            <div className='footer1'>
                <div className="about">
                    <h5>About</h5>
                    
                        <a href=''>Contact Us</a><br/>
                        <a href=''>About Us</a><br/>
                        <a href=''></a>
                    
                </div>

                <div>
                    <h5>Social</h5>
                    
                        <a href='#'>Facebook</a><br/>
                        <a href='#'>YouTube</a><br/>
                        <a href='#'>LinkedIn</a>
                    
                </div>

                <div>
                    <h5>Email Us</h5>
                    
                    <a href="mailto: itanimapaul2001@gmail.com">Tanima Paul</a><br/>
                        <a href='mailto:koushikdas97499@gmail.com'>Koushik Das</a><br/>
                        <a href='mailto:nnadkbdhupguri@gmail.com'>Nityananda Adhikary</a>
                    
                </div>

                <div>
                    <h5>Address</h5>
                    <h6>
                        Kalyani Government Engineering College,<br/>
                        Kalyani Ghoshpara, Kalyani, Nadia, West Bengal, 735210, India
                    </h6>
                </div>
            </div>
            <div className='footer2'>
                <h6>&copy;2023 VegMart</h6>

            </div>
        </footer>
    );
}
export default Footer;