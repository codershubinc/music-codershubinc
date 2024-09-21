import { useAmp } from 'next/amp';
import Head from 'next/head';

export const config = {
    amp: 'hybrid', // Enable hybrid AMP mode
};

const MyPage = () => {
    const isAmp = useAmp();

    return (
        <>
            <Head>
                <title>AMP Ad Example</title>
                {isAmp && (
                    <script
                        async
                        custom-element="amp-ad"
                        src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
                    ></script>
                )}
            </Head>

            <div className="ads-container">
                {isAmp ? (
                    // AMP Adsense ad for AMP version
                    <amp-ad
                        width="100vw"
                        height="320"
                        type="adsense"
                        data-ad-client="ca-pub-1775178587078079"
                        data-ad-slot="2075762019"
                        data-auto-format="rspv"
                        data-full-width=""
                    >
                        <div ></div>
                    </amp-ad>
                ) : (
                    // Fallback or other content for non-AMP version
                    <>
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1775178587078079"
                            crossOrigin="anonymous"></script>
                        {/* <!-- custHorizontalAds --> */}
                        <ins 
                            className='block adsbygoogle'
                            data-ad-client="ca-pub-1775178587078079"
                            data-ad-slot="2075762019"
                            data-ad-format="auto"
                            data-full-width-responsive="true"></ins>
                        <script>
                            (adsbygoogle = window.adsbygoogle || []).push({ });
                        </script>
                    </>
                )}
            </div>
        </>
    );
};

export default MyPage;
