import React, { Component } from 'react';
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
    FaEnvelope,
    FaLinkedin
} from 'react-icons/fa';

class Footer extends Component {
	render() {
		return (
			<div className='footer'>
				<div className='footer-icon'>
					<a href='/' className='facebook'>
						<FaFacebookF />
					</a>
					<a href='https://www.instagram.com/hfdzhilmawan/' className='instagram'>
						<FaInstagram />
					</a>
					<a href='/' className='twitter'>
						<FaTwitter />
					</a>
					<a href='/' className='email'>
						<FaEnvelope />
					</a>
                    <a href='/' className='linked'>
						<FaLinkedin />
					</a>
				</div>
				<div className='footer-text'>
					<p>&copy; 2019 - Hilmawan Hafidzi / Project-Bioskop </p>
				</div>
			</div>
		);
	}
}

export default Footer;