const gSecs = [
    { name: "710GS2029", cpn: 7.10, settlement_date: "2022-04-18", maturity_date: "2029-04-18", price: 103 },
    { name: "833GS2026", cpn: 8.33, settlement_date: "2012-07-09", maturity_date: "2026-07-09", price: 100 },
    { name: "754GS2036", cpn: 7.54, settlement_date: "2022-05-23", maturity_date: "2036-05-23", price: 108.59 },
    { name: "738GS2027", cpn: 7.38, settlement_date: "2022-06-20", maturity_date: "2027-06-20", price: 104.41 },
    { name: "574GS2026", cpn: 5.74, settlement_date: "2021-11-15", maturity_date: "2026-11-15", price: 97.95 }
];
function calculateNextCoupon(settlementDate) {
    let cpnDate = new Date(settlementDate);
    let today = new Date();
    while (cpnDate < today) {
        cpnDate.setMonth(cpnDate.getMonth() + 6);
    }
    return cpnDate;
}
function calculateCouponSchedule(settlementDate, maturityDate) {
    let cpnDate = calculateNextCoupon(settlementDate);
    let paymentDates = [new Date(cpnDate)];
    let maturity = new Date(maturityDate);
    while (cpnDate < maturity) {
        cpnDate.setMonth(cpnDate.getMonth() + 6);
        if (cpnDate <= maturity) paymentDates.push(new Date(cpnDate));
    }
    return paymentDates;
}
function calculateYield(cpn, settlementDate, maturityDate, price) {
    let cpnDate = calculateNextCoupon(settlementDate);
    let effectiveSettlementDate = new Date(cpnDate);
    effectiveSettlementDate.setMonth(effectiveSettlementDate.getMonth() - 6);
    let accruedInterest = (cpn * (new Date() - effectiveSettlementDate) / (360 * 24 * 60 * 60 * 1000));
    let dirtyPrice = price - accruedInterest;
    
    // IRR Calculation (Approximated using Newton-Raphson or financial library)
    let irr = (2 * (dirtyPrice / (cpn / 2))) / 100;
    
    let paymentDates = calculateCouponSchedule(settlementDate, maturityDate);
    let cashflows = [-price, ...Array(paymentDates.length - 1).fill(cpn / 2), 100 + cpn / 2];
    
    // XIRR Calculation (Using Newton's method approximation)
    function xirrApprox(cashflows, dates) {
        let rate = 0.1, tol = 1e-6, maxIter = 100;
        for (let i = 0; i < maxIter; i++) {
            let f = 0, df = 0;
            for (let j = 0; j < cashflows.length; j++) {
                let t = (dates[j] - dates[0]) / (365 * 24 * 60 * 60 * 1000);
                f += cashflows[j] / Math.pow(1 + rate, t);
                df -= (t * cashflows[j]) / Math.pow(1 + rate, t + 1);
            }
            let newRate = rate - f / df;
            if (Math.abs(newRate - rate) < tol) return newRate;
            rate = newRate;
        }
        return rate;
    }
    
    let dates = [new Date(), ...paymentDates, new Date(maturityDate)];
    let xirr = xirrApprox(cashflows, dates) * 100;
    
    return { irr: irr.toFixed(3), xirr: xirr.toFixed(3) };
}
// Frontend Integration
function populateDropdown() {
    let dropdown = document.getElementById("gsecDropdown");
    gSecs.forEach(sec => {
        let option = document.createElement("option");
        option.value = sec.name;
        option.textContent = sec.name;
        dropdown.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    document.getElementById("calculateButton").addEventListener("click", () => {
        let selectedGsec = gSecs.find(sec => sec.name === document.getElementById("gsecDropdown").value);
        let askPrice = parseFloat(document.getElementById("askPrice").value);
        let result = calculateYield(selectedGsec.cpn, selectedGsec.settlement_date, selectedGsec.maturity_date, askPrice);
        document.getElementById("result").textContent = `IRR: ${result.irr}% | XIRR: ${result.xirr}%`;
    });
});
