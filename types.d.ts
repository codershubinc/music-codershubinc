declare namespace JSX {
    interface IntrinsicElements {
        'amp-ad': {
            width: string;
            height: string;
            type: string;
            'data-ad-client': string;
            'data-ad-slot': string;
            'data-auto-format': string;
            'data-full-width': string;
            children?: React.ReactNode;  // Optional children (like <div overflow>)
        };
    }
}
