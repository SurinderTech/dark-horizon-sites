
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.178/build/pdf.worker.mjs`;

export const getTextFromPdf = async (file: File): Promise<string> => {
    const uri = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(uri).promise;
    let content = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        content += textContent.items.map((item: any) => item.str).join(' ');
    }
    URL.revokeObjectURL(uri);
    return content;
};
