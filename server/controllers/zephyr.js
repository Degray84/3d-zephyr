const fs = require('fs')
exports.getModels = async function (req, res, next) {
  try {
    const isCatalog = await fs.existsSync(__dirname + '/../' + 'catalog.json')
    if (isCatalog) {
      const rawCatalog = await fs.readFileSync(__dirname + '/../' + 'catalog.json')
      let catalog = await JSON.parse(rawCatalog)
      res.send({
        success: true,
        description: "Каталог продукции",
        data: catalog
      });
    } else {
      res.send({
        success: false,
        description: "Каталог отсутствует",
      });
    }
    
  } catch (error) {
    next(error);
  }
};
exports.postModel = async function (req, res, next) {
  try {
    let fields = req.fields;
    const files = req.files.files;
    fields.files = []
    if (Array.isArray(files)) {
      files.forEach(file => {
        fields.files.push({
          size: file.size,
          name: file.name.split('.')[0],
          format: file.name.split('.')[1],
          path: file.path,
          modified: file.lastModifiedDate
        })
      })
    } else {
      fields.files.push({
        size: files.size,
        name: files.name.split('.')[0],
        format: files.name.split('.')[1],
        path: files.path,
        modified: files.lastModifiedDate
      })
    }
    const isCatalog = await fs.existsSync(__dirname + '/../' + 'catalog.json')
    if (isCatalog) {
      const rawCatalog = await fs.readFileSync(__dirname + '/../' + 'catalog.json')
      let catalog = await JSON.parse(rawCatalog)
      catalog.push(fields)
      await fs.writeFileSync(__dirname + '/../' + 'catalog.json', JSON.stringify(catalog))
    } else {
      let catalog = []
      catalog.push(fields)
      await fs.writeFileSync(__dirname + '/../' + 'catalog.json', JSON.stringify(catalog))
    }
    res.send({
      success: true,
      description: "Модель добавлена",
      fields
    });
  } catch (error) {
    next(error);
  }
};