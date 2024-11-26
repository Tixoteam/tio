        const products = [
            {
                id: 1,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket Premium A",
                price: 1000,
                limit: 1000,
                duration: "2 Hari"
            },
            {
                id: 2,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket premium B.",
                price: 3000,
                limit: 2000,
                duration: "7 Hari"
            },
            {
                id: 3,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket premium C.",
                price: 5000,
                limit: 6000,
                duration: "30 Hari"
            },
            {
                id: 4,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket sewa A.",
                price: 5000,
                duration: "7 Hari"
            },
            {
                id: 5,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket sewa B.",
                price: 15000,
                duration: "25 Hari"
            },
            {
                id: 6,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket sewa C.",
                price: 20000,
                duration: "30 Hari"
            },
            {
                id: 7,
                image: "https://files.catbox.moe/5hs651.jpg",
                description: "Paket sewa Pro. - Premium + Sewa",
                price: 35000,
                duration: "30 Hari"
            }
        ];

        const productsPerPage = 2;
        let currentPage = 1;

        function renderProducts(page) {
          
            const productList = document.getElementById('product-list');
            productList.classList.remove('loaded'); 
            setTimeout(() => {
            productList.innerHTML = '';

            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const currentProducts = products.slice(start, end);

            currentProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="Produk">
                    <div class="product-details">
                        <h3>${product.description}</h3>
                        <p>Harga: <span>Rp ${product.price.toLocaleString()}</span></p>
                        <p>Durasi: <span>${product.duration}</span></p>
                        ${product.limit ? `<p>Limit: <span>${product.limit > 5000 ? 'Unlimited' : product.limit}</span></p>` : ''}
                        
                    </div>
                    <button onclick="showQR(${product.price}, '${product.description}')">Bayar</button>

                `;
                productList.appendChild(productDiv);
            });
productList.classList.add('loaded'); 
}, 300)
            document.getElementById('prev-page').disabled = page === 1;
            document.getElementById('next-page').disabled = currentPage * productsPerPage >= products.length;
        }
        
        function convertCRC16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
        crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

        function create(qrisData, paymentAmount) {
    try {
        qrisData = qrisData.slice(0, -4);
        const modifiedData = qrisData.replace("010211", "010212");

        const splitData = modifiedData.split("5802ID");
        if (splitData.length !== 2) {
            throw new Error("Invalid QRIS data format");
        }

        const formattedAmount = "54" + ("0" + paymentAmount.toString().length).slice(-2) + paymentAmount;
        const finalData = splitData[0] + formattedAmount + "5802ID" + splitData[1];

        const completeData = finalData + convertCRC16(finalData);

        return completeData;
    } catch (error) {
        console.error("Error creating QR:", error.message);
        throw error;
    }
}
        function showQR(amount, title) {
            const floatingQRDiv = document.getElementById('floating-qr');
            const floatingQRCodeCanvas = document.getElementById('floating-qrcode');
            const mainContent = document.getElementById('main-content');
            const qrCanvas = document.getElementById("floating-qrcode");
            const qrisData = '00020101021126610014COM.GO-JEK.WWW01189360091439152058080210G9152058080303UKE51440014ID.CO.QRIS.WWW0215ID10243499893180303UKE5204504553033605802ID5919Tio Store, MGNG SKT6010MUSI RAWAS61053165762070703A0163048581';
            const qrCodeData = create(qrisData, amount);

            QRCode.toCanvas(floatingQRCodeCanvas, qrCodeData, {
                width: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
            }, function (error) {
                if (error) {
                    console.error(error);
                } else {
                    floatingQRDiv.style.display = 'block';
                    mainContent.classList.add('blur-background');
                }
            });

            document.getElementById("download-btn").onclick = function () {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = qrCanvas.toDataURL();
                link.click();
            };

            const whatsappBtn = document.getElementById('whatsapp-btn');
            whatsappBtn.onclick = () => {
                const whatsappNumber = "6282285357346"; 
                const message = `Halo, saya telah melakukan pembayaran ${title} sebesar Rp ${amount.toLocaleString()}. Mohon konfirmasi.`;
                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
            };
        }

        // Fungsi untuk menutup QR mengambang
        function closeFloatingQR() {
            const floatingQRDiv = document.getElementById('floating-qr');
            const mainContent = document.getElementById('main-content');
            floatingQRDiv.style.display = 'none';
            mainContent.classList.remove('blur-background');
        }

        // Pagination controls
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(currentPage);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage * productsPerPage < products.length) {
                currentPage++;
                renderProducts(currentPage);
            }
        });

        renderProducts(currentPage);