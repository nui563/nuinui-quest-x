window.onload = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const resize = () => {
        const scale = Math.max(1, Math.min(innerWidth / 256, innerHeight / 224));
        canvas.style.transform = `scale(${scale})`;
    }
    window.onresize = resize;
    resize();

    const pekoImg = new Image();
    pekoImg.src = 'peko.png';

    const fontImg = new Image();
    fontImg.src = 'font.png';

    const fontmap = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789 ',
        '!"#()*,./:;..<>?[$]^_-=...',
    ]

    const text = [
        'YOU REALLY THOUGHT IT    ',
        'WOULD BE THAT EASY, DID  ',
        'YOU PEKO? SHIRAKEN MAY   ',
        'HAVE WON LAST TIME, BUT  ',
        'THE WAR IS FAR FROM OVER.',
        'IN TIME I WILL FIND OTHER',
        'MEMBERS STRONG ENOUGH TO ',
        'DO MY BIDDING AND I WILL ',
        'RETURN. I SHALL SEE YOU  ',
        'SOON PEKO, VERY SOON...  ',
    ];

    //60fps
    const tick = 1000 / 60;


    const introLength = 120;

    let frameCount = 0;
    let charCount = 0;
    setInterval(() => {
        charCount = Math.floor((frameCount - introLength) / 4);
        if (frameCount > introLength && charCount < text.join('').length && frameCount % 8 === 0) {
            const sound = new Audio('menu.wav');
            sound.volume = 0.1;
            sound.play();
        }
        frameCount++;
    }, tick);

    const frame = () => {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(pekoImg, (frameCount < introLength ? Math.floor(frameCount / introLength * 3) : 2) * 128, 0, 128, 128, canvas.width * .5 - 64, 0, 128, 128);
        if (frameCount < introLength) {
            ctx.globalAlpha = Math.max(0, frameCount - 30) / introLength;
        }
        ctx.drawImage(pekoImg, 7 * 128, 0, 128, 128, canvas.width * .5 - 64, 0, 128, 128);
        ctx.restore();

        //dispay text
        if (frameCount > introLength) {
            ctx.save();
            ctx.translate(32, 128 + 4);
            text.forEach((line, i) => {
                ctx.drawImage(fontImg, 0, 0, 8, 8, 0, 128 + i * 8, 8, 8);
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    const charIndex = fontmap.findIndex(row => row.includes(char));
    
                    if (charCount < i * line.length + j) {
                        break;
                    }

                    const charRow = fontmap[charIndex];
                    const charCol = charRow.indexOf(char);
                    if (charCount === i * line.length + j) {
                        ctx.fillStyle = '#FFBF7F';
                        ctx.fillRect(j * 8, i * 9, 7, 7);
                    } else ctx.drawImage(fontImg, charCol * 9, charIndex * 9, 8, 8, j * 8, i * 9, 8, 8);
                }
            });
            ctx.restore();
        }

        requestAnimationFrame(frame);
    }

    frame();
}