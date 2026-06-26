const PRICE_DATABASE = {
    parket: { sade: 30, premium: 50, luks: 70 },
    boya:   { sade: 10, premium: 20, luks: 35 },
    kafel:  { sade: 20, premium: 40, luks: 60 },
    suvaq:  { sade: 8,  premium: 15, luks: 25 }
};

function openCalculator() {
    document.getElementById('calculator-modal').style.display = 'flex';
}

function closeCalculator() {
    document.getElementById('calculator-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeCalculator();
        });
    }
});

function addRoom() {
    var container = document.getElementById('rooms-container');
    var row = document.createElement('div');
    row.className = 'room-row';
    row.style.cssText = 'display:flex; gap:10px; margin-bottom:10px; align-items:center;';
    row.innerHTML =
        '<input type="text" placeholder="Otaq adı" class="room-name" style="flex:2; padding:10px; border-radius:6px; border:1px solid #444; background:#333; color:#fff;">' +
        '<input type="number" placeholder="m²" class="room-size" min="1" style="flex:1; padding:10px; border-radius:6px; border:1px solid #444; background:#333; color:#fff;">' +
        '<button onclick="removeRoom(this)" style="background:transparent; border:1px solid #c0392b; color:#c0392b; border-radius:6px; padding:8px 12px; cursor:pointer; font-size:1rem; flex-shrink:0;">✕</button>';
    container.appendChild(row);
}

function removeRoom(btn) {
    var rows = document.querySelectorAll('.room-row');
    if (rows.length === 1) { alert('Ən azı bir otaq olmalıdır.'); return; }
    btn.parentElement.remove();
}

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function calculateBudget() {
    var work = document.getElementById('work-type').value;
    var quality = document.getElementById('quality-level').value;
    var names = document.querySelectorAll('.room-name');
    var sizes = document.querySelectorAll('.room-size');
    var resultDiv = document.getElementById('result');

    var PRICE_PER_SQM = PRICE_DATABASE[work][quality];
    var rows = [], totalSqm = 0, hasError = false;

    for (var i = 0; i < sizes.length; i++) {
        var name = names[i].value.trim() || ('Otaq ' + (i + 1));
        var size = parseFloat(sizes[i].value);
        if (!sizes[i].value || isNaN(size) || size <= 0) {
            hasError = true;
            sizes[i].style.borderColor = '#c0392b';
        } else {
            sizes[i].style.borderColor = '#444';
            totalSqm += size;
            rows.push({ name: name, size: size });
        }
    }

    if (hasError) {
        resultDiv.innerHTML = '<p style="color:#f5a6ad; background:rgba(220,53,69,0.15); border:1px solid #dc3545; padding:12px; border-radius:6px; text-align:center;">⚠️ Zəhmət olmasa bütün otaqların ölçüsünü daxil edin.</p>';
        return;
    }

    var minTotal = Math.round(totalSqm * PRICE_PER_SQM * 0.9);
    var maxTotal = Math.round(totalSqm * PRICE_PER_SQM * 1.1);

    var tableRows = '';
    for (var j = 0; j < rows.length; j++) {
        var rMin = Math.round(rows[j].size * PRICE_PER_SQM * 0.9);
        var rMax = Math.round(rows[j].size * PRICE_PER_SQM * 1.1);
        tableRows += '<tr><td style="padding:8px 12px; border-bottom:1px solid #333;">' + rows[j].name + '</td><td style="padding:8px 12px; border-bottom:1px solid #333; text-align:center;">' + rows[j].size + ' m²</td><td style="padding:8px 12px; border-bottom:1px solid #333; text-align:right; color:#e5b869;">' + formatPrice(rMin) + ' – ' + formatPrice(rMax) + ' ₼</td></tr>';
    }

    resultDiv.innerHTML =
        '<div style="background:rgba(229,184,105,0.07); border:1px solid rgba(229,184,105,0.3); border-radius:8px; padding:20px; margin-top:10px;">' +
        '<table style="width:100%; border-collapse:collapse; font-size:0.9rem; color:#ddd;"><thead><tr style="color:#e5b869; font-weight:600;"><th style="padding:8px 12px; text-align:left; border-bottom:1px solid #444;">Otaq</th><th style="padding:8px 12px; text-align:center; border-bottom:1px solid #444;">Sahə</th><th style="padding:8px 12px; text-align:right; border-bottom:1px solid #444;">Təxmini Qiymət</th></tr></thead><tbody>' + tableRows + '</tbody></table>' +
        '<div style="margin-top:16px; padding-top:16px; border-top:1px solid #444; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;"><span style="color:#aaa; font-size:0.9rem;">Ümumi: <strong style="color:#fff;">' + totalSqm + ' m²</strong></span><span style="color:#e5b869; font-size:1.05rem; font-weight:700;">' + formatPrice(minTotal) + ' – ' + formatPrice(maxTotal) + ' ₼</span></div>' +
        '<p style="color:#888; font-size:0.8rem; margin-top:14px; margin-bottom:0; text-align:center;">* Qiymətlər yalnız təxminidir. Dəqiq rəqəm üçün bizə müraciət edin.</p></div>';

    fetch('/calculator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rooms: rows.map(r => ({ name: r.name, size: r.size })),
            work_type: work,
            quality: quality
        })
    });
}