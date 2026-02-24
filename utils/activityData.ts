export const getActivityLevel = (date: Date): number => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate(); // 1-31
    const year = date.getFullYear();

    // December 2025 (Month 11)
    if (month === 11 && year === 2025) {
        // Dec 1, 2, 3 are Active (Level 4)
        if (day <= 3) return 4;
        return 0; // Future days
    }

    // November 2025 (Month 10)
    if (month === 10 && year === 2025) {
        // Deterministic "Random" based on date
        // Simple hash: (day * magic) % 100
        const hash = (day * 2654435761) % 100;

        // First half (1-14): Sparse (30% chance)
        if (day <= 14) {
            return hash < 30 ? 1 : 0;
        }
        // Second half (15-30): High Density (80% chance)
        else {
            if (hash < 80) {
                // Levels 1-4 based on hash
                if (hash < 20) return 1;
                if (hash < 40) return 2;
                if (hash < 60) return 3;
                return 4;
            }
            return 0;
        }
    }

    // Before November: Empty
    return 0;
};
