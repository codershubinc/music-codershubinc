const isNotPc = () => {
    return window.innerWidth <= 1024;  // Typical breakpoint for mobile/tablet (1024px or less)
};

export {
    isNotPc
}