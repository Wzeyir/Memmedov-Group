// Otaq əlavə etmək funksiyası
function addRoom() {
    const container = document.getElementById('rooms-container');
    const div = document.createElement('div');
    div.className = 'room-row';
    // CSS-i təmiz saxlamaq üçün stil birbaşa bura yazıldı
    div.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
    
    div.innerHTML = `
        <input type="text" placeholder="Otaq adı" class="room-name" style="flex: 2; padding: 10px; border-radius: 6px; border: 1px solid #444; background: #333; color: #fff;">
        <input type="number" placeholder="m²" class="room-size" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #444; background: #333; color: #fff;">
        <button onclick="removeRoom(this)" style="flex: 0 0 auto; padding: 10px 14px; border-radius: 6px; border: 1px solid #e5b869; background: transparent; color: #e5b869; cursor: pointer; font-size: 1.1rem;">&times;</button>
    `;
    container.appendChild(div);
}

// Otaq sətrini silmək funksiyası
function removeRoom(button) {
    const container = document.getElementById('rooms-container');
    if (container.children.length > 1) {
        button.closest('.room-row').remove();
    }
}

// Hesablama funksiyası
function calculateBudget() {
    let totalArea = 0;
    // Bütün otaqların kvadratını toplayır
    document.querySelectorAll('.room-size').forEach(input => {
        totalArea += parseFloat(input.value) || 0;
    });

    // Orta bazar qiymətləri (m² üçün)
    const paintPricePerM2 = 15; 
    const floorPricePerM2 = 45; 
    
    const totalPaint = totalArea * paintPricePerM2;
    const totalFloor = totalArea * floorPricePerM2;
    const grandTotal = totalPaint + totalFloor;

    // Nəticəni ekrana çıxarır
    document.getElementById('result').innerHTML = `
        <div style="background: rgba(229, 184, 105, 0.1); padding: 20px; border-radius: 8px; border: 1px solid #e5b869;">
            <p style="margin: 5px 0;">Ümumi sahə: <b>${totalArea} m²</b></p>
            <p style="margin: 5px 0;">Boya xərcləri: <b>${totalPaint} AZN</b></p>
            <p style="margin: 5px 0;">Parket xərcləri: <b>${totalFloor} AZN</b></p>
            <hr style="border-color: #e5b869;">
            <p style="color: #e5b869; font-size: 1.5rem; font-weight: bold; margin-top: 10px;">Ümumi: ${grandTotal} AZN</p>
        </div>
    `;
}

// Kalkulyator pəncərəsini bağlamaq funksiyası
function closeCalculator() {
    document.getElementById('calculator-modal').style.display = 'none';
}