
const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");
const message = document.getElementById("message");
const nameList = document.getElementById("nameList");

// Supabase se sabhi submitted names dikhana
async function showNames() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/visitors?select=id,name,created_at&order=created_at.desc`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Names load nahi hue");
        }

        const names = await response.json();
        nameList.replaceChildren();

        names.forEach(function (item) {
            const li = document.createElement("li");
            li.textContent = item.name;
            nameList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        message.textContent = "Names load nahi ho rahe. Please try again.";
    }
}

// Naya name database mein save karna
nameForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();

    if (!name || name.length > 50) {
        message.textContent = "1 se 50 characters ka naam enter karein.";
        return;
    }

    const submitButton = nameForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/visitors`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({ name: name })
            }
        );

        if (!response.ok) {
            throw new Error("Name save nahi hua");
        }

        message.textContent = "Thank you, " + name + "! Name submitted successfully.";
        nameInput.value = "";
        await showNames();
    } catch (error) {
        console.error(error);
        message.textContent = "Name submit nahi hua. Supabase settings check karein.";
    } finally {
        submitButton.disabled = false;
    }
});

// Page khulte hi names load karna
showNames();

// Har 10 second mein list refresh karna
setInterval(showNames, 10000);
const SUPABASE_URL = "https://zarxrlqlnepztzasisbk.supabase.co";
const SUPABASE_KEY = "sb_publishable_IeFxpcT6KxYXFJV6o6ufuQ_4eOjI2cJ";
