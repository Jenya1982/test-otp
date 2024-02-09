import fs from 'fs/promises';
import { parse } from 'csv-parse';

async function generateRandomIndices(maxIndex) {
    const indices = [];
    while (indices.length < 3) {
        const randomIndex = Math.floor(Math.random() * maxIndex) + 1;
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}

export default async function getRandomCities(csvFilePath) {
    try {
        const csvData = await fs.readFile(csvFilePath, 'utf-8');
        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true
        });

        const totalCities = records.length;
        const randomIndices = await generateRandomIndices(totalCities);
        const randomCities = randomIndices.map(index => {
            if (index <= records.length) {
                return records[index - 1].city;
            } else {
                return null;
            }
        });

        return randomCities;
    } catch (error) {
        console.error('Error reading CSV file:', error);
        return [];
    }
}
