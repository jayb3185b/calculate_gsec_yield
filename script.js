const gSecs = [
    { name: "710GS2029", cpn: 7.10, settlement_date: "2022-04-18", maturity_date: "2029-04-18", price: 103 },
    { name: "833GS2026", cpn: 8.33, settlement_date: "2012-07-09", maturity_date: "2026-07-09", price: 100 },
    { name: "754GS2036", cpn: 7.54, settlement_date: "2022-05-23", maturity_date: "2036-05-23", price: 108.59 },
    { name: "738GS2027", cpn: 7.38, settlement_date: "2022-06-20", maturity_date: "2027-06-20", price: 104.41 },
    { name: "574GS2026", cpn: 5.74, settlement_date: "2021-11-15", maturity_date: "2026-11-15", price: 97.95 }
];

function calculateYield(cpn, settlement_date, maturity_date, price) {
    let irr = ((cpn / price) * 100).toFixed(3);
    let xirr = ((cpn / price) * 105).toFixed(3);
    return { irr, xirr };
}

document.addEventListener("DOMContentLoaded", () => {
    const dropdownContainer = document.getElementById("dropdownContainer");
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search...");
    searchInput.classList.add("search-input");
    dropdownContainer.appendChild(searchInput);
    
    const dropdown = document.createElement("select");
    dropdown.setAttribute("id", "gsecDropdown");
    dropdownContainer.appendChild(dropdown);

    function populateDropdown(filteredGSecs = gSecs) {
        dropdown.innerHTML = "";
        filteredGSecs.forEach(sec => {
            let option = document.createElement("option");
            option.value = sec.name;
            option.textContent = sec.name;
            dropdown.appendChild(option);
        });
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredGSecs = gSecs.filter(sec => sec.name.toLowerCase().includes(searchTerm));
        populateDropdown(filteredGSecs);
    });

    populateDropdown();

    document.getElementById("calculateButton").addEventListener("click", () => {
        let selectedGsec = gSecs.find(sec => sec.name === dropdown.value);
        if (!selectedGsec) {
            document.getElementById("result").textContent = "Please select a valid security";
            return;
        }
        let askPrice = parseFloat(document.getElementById("askPrice").value);
        if (isNaN(askPrice) || askPrice <= 0) {
            document.getElementById("result").textContent = "Enter a valid ask price";
            return;
        }
        let result = calculateYield(selectedGsec.cpn, selectedGsec.settlement_date, selectedGsec.maturity_date, askPrice);
        document.getElementById("result").textContent = `IRR: ${result.irr}% | XIRR: ${result.xirr}%`;
    });
});
