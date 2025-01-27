declare module 'docx-pdf' {
    function docxConverter(inputPath: string, outputPath: string, callback: (err: Error | null, result: string) => void): void;
    export = docxConverter;
}
