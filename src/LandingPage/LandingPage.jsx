import React, { useEffect, useRef, useLayoutEffect } from 'react';
import cl from './LandingPage.module.css';
import AWPWireframe from '../TOOLS/AWPWireFrame.jsx';
import ImageCarousel from '../TOOLS/ImageCarousel.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/effect-creative';
import { EffectCreative } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

// import required modules
import { Mousewheel, Pagination } from 'swiper/modules';

const LandingPage = () => {
    const [randomSkins, setRandomSkins] = React.useState([]);
    const cardRefs = useRef([]);
    const swiperRef = useRef(null);
    const navigate = useNavigate('')

    const reviews = [
        {
            text: "SkinVolt made it super easy to track my favorite skins. The filters are powerful and save me tons of time.",
            author: "Alex Green"
        },
        {
            text: "I finally understand skin prices and wear levels thanks to SkinVolt. Clear charts and data — love it!",
            author: "Marta Schneider"
        },
        {
            text: "The live price updates already saved me money twice. It feels like having a personal trading assistant.",
            author: "Kevin Parker"
        },
        {
            text: "I love the clean design — browsing and comparing skins feels smooth and professional.",
            author: "Liam Roberts"
        },
        {
            text: "Perfect for traders like me. I check SkinVolt daily before making deals, and it always gives me the edge.",
            author: "Sophia Miller"
        },
        {
            text: "I discovered rare skins I didn’t even know existed. The search is just awesome!",
            author: "Daniel White"
        },
        {
            text: "SkinVolt quickly became my go-to tool. It combines everything I need in one place.",
            author: "Emily Johnson"
        },
        {
            text: "The accuracy of market prices is insane. I trust the numbers here more than anywhere else.",
            author: "Michael Brown"
        },
        {
            text: "Super intuitive and fast. I recommended SkinVolt to my friends and now we all use it.",
            author: "Olivia Davis"
        },
        {
            text: "This platform helped me get better deals and actually profit from trades. Totally worth it.",
            author: "James Wilson"
        }
    ];


    useEffect(() => {
        const fetchRandomSkins = async () => {
            try {
                const res = await fetch('http://localhost:3000/random');
                const data = await res.json();
                setRandomSkins(data);
                swiperRef.current?.update();
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };
        fetchRandomSkins();
    }, []);
    console.log(randomSkins);

    


    useLayoutEffect(() => {
        const nodes = cardRefs.current.filter(Boolean);
        if (!nodes.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        // Find the correct index for this card
                        const i = nodes.indexOf(card);
                        if (i === -1) return;
                        card.classList.add(cl.enter, cl['entrance-anim'], cl[`entrance-delay-${i + 1}`]);
                        setTimeout(() => {
                            card.classList.remove(cl['entrance-anim'], cl[`entrance-delay-${i + 1}`]);
                        }, 800);
                        observer.unobserve(card);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        nodes.forEach((card) => observer.observe(card));

        return () => nodes.forEach((card) => observer.unobserve(card));
    }, []);

    return (
        <div className={cl.whole_landing_page}>
            <div className={cl.first_block}>
                <div className={cl.awp_and_background_container}>
                    <AWPWireframe />
                </div>
                <div className={cl.header}>
                    <div className={cl.row}>
                        <div className={cl.left_text}>
                            <h1>
                                Expand your <br />
                                CS2 Skin Knowledge<br />
                                with SkinVolt
                            </h1>
                            <p>
                                SkinVolt provides up-to-date about<br />
                                your favourite skins, all in your browser, phone or PC.<br />
                                Search for any information about your favourite skins,<br />
                                like price, category, rarity and more!<br />
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cl.second_block}>
                <div className={cl.second_block_main_text}>
                    <h1>What is SkinVolt?</h1>
                    <div className={cl.benefit_cards}>
                        {[
                            {
                                title: 'Search',
                                delay: 'entrance-delay-1',
                                text: 'Quickly find the perfect skin<br />Use powerful search filters to find skins by name, category, rarity, or price range. Whether you’re hunting for a rare collectible or a budget-friendly option, SkinVolt helps you locate it fast and easily.',
                            },
                            {
                                title: 'Explore',
                                delay: 'entrance-delay-2',
                                text: 'Detailed information at your fingertips<br />Dive deep into every skin’s details: pricing history, wear levels, popularity trends, and more. Understand the nuances behind each skin and make smarter decisions.',
                            },
                            {
                                title: 'Stay Updated',
                                delay: 'entrance-delay-3',
                                text: 'Real-time market insights<br />Keep track of the latest trends and price changes in the CS2 skin market. SkinVolt provides you with live updates so you never miss a chance to buy or sell at the right time.',
                            },
                        ].map((card, index) => (
                            <div
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`${cl.benefit_card}`}
                            >
                                <span className={cl.benefit_title}>
                                    <h2>{card.title}</h2>
                                </span>
                                <p
                                    dangerouslySetInnerHTML={{ __html: card.text.replace(/<br\s*\/?>/g, '<br/ >') }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cl.third_block}>
                <h1>Best Offers just for YOU!</h1>
                <div className={cl.random_skins_container}>
                    {randomSkins.length > 0 ? (
                        <Swiper
                            grabCursor={true}
                            loop={true}
                            effect={'creative'}
                            creativeEffect={{
                                prev: {
                                    shadow: true,
                                    translate: ['-120%', 0, -500],
                                },
                                next: {
                                    shadow: true,
                                    translate: ['120%', 0, -500],
                                },
                            }}
                            modules={[EffectCreative]}
                            className={cl.mySwiper}
                        >
                            {randomSkins.map((skin, index) => (
                                <SwiperSlide key={index}>
                                    <div className={cl.skin_card}>
                                        <img
                                            src={`http://localhost:3000${skin.imageUrl}`}
                                            alt={`Skin ${index}`}
                                        />
                                        <div style={{ textAlign: 'center' }}>
                                            <h1 className={cl.skin_title}>{skin.name}</h1>
                                            <p className={cl.skin_price}>Price: ${skin.price}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p>Loading skins...</p>
                    )}
                </div>

            </div>
            <div className={cl.fourth_block}>
                <div className={cl.fourth_block_main_text}>
                    <i class="ph ph-users" style={{ fontSize: '55px' }}></i><h1>Learn what others tell about us</h1>
                </div>
                <div className={cl.reviews_container}>
                    <Swiper
                        className={cl.reviewsSwiper}
                        slidesPerView={3}
                        centeredSlides={false}
                        spaceBetween={30}
                        grabCursor={true}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                    >
                        {reviews.map((rev, index) => {
                            return <SwiperSlide key={index}>
                                <div className={cl.review_card}>
                                    <div className={cl.author_block}>
                                        <i class="ph ph-user-sound" style={{ fontSize: "45px" }}></i>
                                        <h1 >{rev.author}</h1>
                                    </div>
                                    <p className={cl.text}>{rev.text}</p>
                                </div>
                            </SwiperSlide>
                        })}
                    </Swiper>
                </div>
            </div>
            <div className={cl.fifth_block}>
                <div className={cl.fifth_block_main_text}>
                    <h1>Start exploring skins smarter today</h1>
                </div>
                <div className={cl.fifth_block_secondary_text}>
                    <p>
                        Join thousands of traders already using SkinVolt to discover, compare,
                        and profit from CS2 skins. Don’t miss your chance to get ahead.
                    </p>
                </div>
                <button className={cl.cta_button} onClick={() => navigate('/client')}>Get Started Now</button>
            </div >
        </div >
    );
};

export default LandingPage;