import React, { useEffect, useState } from "react";
import "../Styles/PasswordGenerator.css";

function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(8);
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [message, setMessage] = useState("");
    const [customPassword, setCustomPassword] = useState(false);

    const [savedPasswords, setSavedPasswords] = useState(() => {
        try {
            const saved = localStorage.getItem("savedPasswords");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [visibleSavedPasswords, setVisibleSavedPasswords] = useState({});

    const [includeLowercase, setIncludeLowercase] = useState(false);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    useEffect(() => {
        localStorage.setItem(
            "savedPasswords",
            JSON.stringify(savedPasswords)
        );
    }, [savedPasswords]);

    const generatePassword = () => {
        if (customPassword) {
            setMessage("Turn off Custom Password to generate a password");
            return;
        }

        if (Number(length) < 8) {
            setMessage("Please select at least 8 characters");
            setPassword("");
            return;
        }

        let characters = "";

        if (includeLowercase) characters += lowercase;
        if (includeUppercase) characters += uppercase;
        if (includeNumbers) characters += numbers;
        if (includeSymbols) characters += symbols;

        if (!characters) {
            setMessage("Please select at least one option");
            return;
        }

        let newPassword = "";

        for (let i = 0; i < Number(length); i++) {
            const randomCharacter =
                characters[Math.floor(Math.random() * characters.length)];

            newPassword += randomCharacter;
        }

        setPassword(newPassword);
        setCopied(false);
        setShowPassword(false);
        setMessage("");
    };

    const handleCustomPasswordChange = (e) => {
        const value = e.target.value;

        if (value.length > 20) {
            setMessage("Password cannot be longer than 20 characters");
            return;
        }

        setPassword(value);
        setLength(value.length);
        setCopied(false);
        setMessage("");
    };

    const toggleCustomPassword = () => {
        setCustomPassword((prev) => !prev);
        setMessage("");
        setCopied(false);
        setShowPassword(false);
    };

    const copyPassword = async () => {
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            setMessage("Unable to copy password");
        }
    };

    const savePassword = () => {
        if (!password) {
            setMessage("First generate or enter a password");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must contain at least 8 characters");
            return;
        }

        if (password.length > 20) {
            setMessage("Password cannot be longer than 20 charactenrs");
            return;
        }

        const newSavedPassword = {
            id: `${Date.now()}-${Math.random()}`,
            password: password,
            createdAt: new Date().toLocaleString()
        };

        setSavedPasswords((prev) => [
            newSavedPassword,
            ...prev
        ]);

        setMessage("Password saved successfully");
    };

    const deletePassword = (id) => {
        setSavedPasswords((prev) =>
            prev.filter((item) => item.id !== id)
        );

        setVisibleSavedPasswords((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });

        setMessage("Password deleted");
    };

    const copySavedPassword = async (savedPassword) => {
        try {
            await navigator.clipboard.writeText(savedPassword);
            setMessage("Password copied");
        } catch {
            setMessage("Unable to copy password");
        }
    };

    const toggleSavedPassword = (id) => {
        setVisibleSavedPasswords((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    const handleLengthChange = (e) => {
        setLength(Number(e.target.value));
        setMessage("");
    };

    return (
        <div
            className={`password-page ${darkMode ? "dark-theme" : "light-theme"
                }`}
        >
            {message && (
                <p
                    className={`password-message ${message === "Password deleted" ? "delete-message" : ""}`}
                    role="status"
                >
                    <i className="fa-solid fa-circle-info"></i>
                    {message}
                </p>
            )}

            <div className="password-layout">

                <div className="password-generator">

                    <div className="theme-container">
                        <button
                            className="theme-button"
                            onClick={toggleTheme}
                            type="button"
                        >
                            {darkMode ? (
                                <>
                                    <i className="fa-solid fa-sun"></i>
                                    <span>Light</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-moon"></i>
                                    <span>Dark</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="password-header">
                        <h1 className="password-title">
                            Password Generator
                        </h1>

                        <p className="password-subtitle">
                            Create a strong and secure password
                        </p>
                    </div>

                    <div className="custom-password-container">

                        <div className="custom-password-info">

                            <div className="custom-password-icon">
                                <i className="fa-solid fa-pen"></i>
                            </div>

                            <div className="custom-password-text">

                                <h3 className="custom-password-title">
                                    Custom Password
                                </h3>

                                <p className="custom-password-subtitle">
                                    Create your own password
                                </p>

                            </div>

                        </div>

                        <button
                            className={`custom-toggle ${customPassword ? "active" : ""
                                }`}
                            onClick={toggleCustomPassword}
                            type="button"
                        >
                            <span className="custom-toggle-circle"></span>
                        </button>

                    </div>

                    <div className="password-display-container">

                        <div
                            className={`password-display ${customPassword
                                ? "custom-active"
                                : ""
                                }`}
                        >
                            {customPassword ? (
                                <input
                                    className="custom-password-input"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={
                                        handleCustomPasswordChange
                                    }
                                    placeholder="Type your password..."
                                    maxLength="20"
                                />
                            ) : (
                                <p className="generated-password">
                                    {password
                                        ? showPassword
                                            ? password
                                            : "•".repeat(
                                                password.length
                                            )
                                        : "Your password will appear here"}
                                </p>
                            )}
                        </div>

                        <button
                            className="show-password-button"
                            onClick={togglePassword}
                            disabled={!password}
                            type="button"
                        >
                            {showPassword ? (
                                <i className="fa-solid fa-eye-slash"></i>
                            ) : (
                                <i className="fa-solid fa-eye"></i>
                            )}
                        </button>

                    </div>

                    {customPassword && (
                        <div className="custom-password-counter">

                            <span>
                                {password.length}/20 characters
                            </span>

                            <span>
                                Minimum 8 characters
                            </span>

                        </div>
                    )}

                    <div className="password-action-buttons">

                        <button
                            className={`copy-button ${copied ? "copied" : ""
                                }`}
                            onClick={copyPassword}
                            disabled={!password}
                            type="button"
                        >
                            {copied ? (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    Copied
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-copy"></i>
                                    Copy
                                </>
                            )}
                        </button>

                        <button
                            className="save-button"
                            onClick={savePassword}
                            disabled={!password}
                            type="button"
                        >
                            <i className="fa-solid fa-bookmark"></i>
                            Save
                        </button>

                    </div>

                    {!customPassword && (
                        <>
                            <div className="length-container">

                                <div className="length-header">

                                    <label
                                        className="length-label"
                                        htmlFor="password-length"
                                    >
                                        Password Length
                                    </label>

                                    <span className="length-value">
                                        {length}
                                    </span>

                                </div>

                                <input
                                    id="password-length"
                                    className="length-section"
                                    type="range"
                                    min="8"
                                    max="20"
                                    value={length}
                                    onChange={handleLengthChange}
                                />

                                <div className="range-values">

                                    <span className="range-min">
                                        8
                                    </span>

                                    <span className="range-max">
                                        20
                                    </span>

                                </div>

                                <p className="length-text">
                                    Choose password length between
                                    8 and 20
                                </p>

                            </div>

                            <div className="options-container">

                                <div className="option-group">

                                    <label className="option-label">

                                        <input
                                            className="option-checkbox"
                                            type="checkbox"
                                            checked={
                                                includeLowercase
                                            }
                                            onChange={(e) =>
                                                setIncludeLowercase(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span className="checkbox-custom"></span>

                                        <span className="option-text">
                                            Lowercase
                                        </span>

                                    </label>

                                </div>

                                <div className="option-group">

                                    <label className="option-label">

                                        <input
                                            className="option-checkbox"
                                            type="checkbox"
                                            checked={
                                                includeUppercase
                                            }
                                            onChange={(e) =>
                                                setIncludeUppercase(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span className="checkbox-custom"></span>

                                        <span className="option-text">
                                            Uppercase
                                        </span>

                                    </label>

                                </div>

                                <div className="option-group">

                                    <label className="option-label">

                                        <input
                                            className="option-checkbox"
                                            type="checkbox"
                                            checked={
                                                includeNumbers
                                            }
                                            onChange={(e) =>
                                                setIncludeNumbers(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span className="checkbox-custom"></span>

                                        <span className="option-text">
                                            Numbers
                                        </span>

                                    </label>

                                </div>

                                <div className="option-group">

                                    <label className="option-label">

                                        <input
                                            className="option-checkbox"
                                            type="checkbox"
                                            checked={
                                                includeSymbols
                                            }
                                            onChange={(e) =>
                                                setIncludeSymbols(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <span className="checkbox-custom"></span>

                                        <span className="option-text">
                                            Symbols
                                        </span>

                                    </label>

                                </div>

                            </div>

                            <button
                                className="generate-button"
                                onClick={generatePassword}
                                disabled={
                                    !includeLowercase &&
                                    !includeUppercase &&
                                    !includeNumbers &&
                                    !includeSymbols
                                }
                                type="button"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                Generate Password
                            </button>

                        </>
                    )}

                    {customPassword && (
                        <div className="custom-mode-message">

                            <i className="fa-solid fa-pen-to-square"></i>

                            <span>
                                Custom mode is ON. Type your own
                                password above.
                            </span>

                        </div>
                    )}

                </div>

                <div className="saved-passwords">

                    <div className="saved-header">

                        <div>

                            <h2 className="saved-title">
                                Saved Passwords
                            </h2>

                            <p className="saved-subtitle">
                                Your saved passwords
                            </p>

                        </div>

                        <span className="saved-count">
                            {savedPasswords.length}
                        </span>

                    </div>

                    {savedPasswords.length === 0 ? (
                        <div className="empty-passwords">

                            <div className="empty-icon">
                                <i className="fa-solid fa-lock"></i>
                            </div>

                            <h3 className="empty-title">
                                No Saved Passwords
                            </h3>

                            <p className="empty-text">
                                Generate or create a password and
                                click Save to keep it here.
                            </p>

                        </div>
                    ) : (
                        <div className="saved-list">

                            {savedPasswords.map((item) => (
                                <div
                                    className="saved-password-card"
                                    key={item.id}
                                >

                                    <div className="saved-password-top">

                                        <div className="saved-password-icon">
                                            <i className="fa-solid fa-key"></i>
                                        </div>

                                        <div className="saved-password-info">

                                            <p className="saved-password-text">

                                                {visibleSavedPasswords[
                                                    item.id
                                                ]
                                                    ? item.password
                                                    : "•".repeat(
                                                        item.password
                                                            .length
                                                    )}

                                            </p>

                                            <span className="saved-date">
                                                {item.createdAt}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="saved-password-actions">

                                        <button
                                            className="saved-action-button"
                                            onClick={() =>
                                                toggleSavedPassword(
                                                    item.id
                                                )
                                            }
                                            type="button"
                                            title="Show Password"
                                        >
                                            {visibleSavedPasswords[
                                                item.id
                                            ] ? (
                                                <i className="fa-solid fa-eye-slash"></i>
                                            ) : (
                                                <i className="fa-solid fa-eye"></i>
                                            )}
                                        </button>

                                        <button
                                            className="saved-action-button"
                                            onClick={() =>
                                                copySavedPassword(
                                                    item.password
                                                )
                                            }
                                            type="button"
                                            title="Copy Password"
                                        >
                                            <i className="fa-solid fa-copy"></i>
                                        </button>

                                        <button
                                            className="saved-action-button delete-button"
                                            onClick={() =>
                                                deletePassword(
                                                    item.id
                                                )
                                            }
                                            type="button"
                                            title="Delete Password"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default PasswordGenerator;
