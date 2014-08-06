function generateMat()
    xDoc = xmlread('data.xml');
    xRoot = xDoc.getDocumentElement;
    xData = parseXML(xRoot);
    clear xDoc xRoot;
    fieldNames = fields(xData);
    for i=1:length(fieldNames)
        eval(sprintf('%s = xData.%s;', fieldNames{i}, fieldNames{i}));
    end
    fileName = strrep(datestr(now), ' ', '_');
    fileName = strcat(fileName,'.mat');
    clear xData i fieldNames;
    
    save(fileName);

end