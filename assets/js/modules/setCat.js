export default (data) => {
  console.log(data)
  return `
  <div
    class="input_categorie h-5 flex items-center space-x-1 bg-white py-1 mb-0.5 mx-0.5 pl-2 rounded-lg">
    <span class="text-xs uppercase">${data.name}</span>
    <span class="material-icons cursor-pointer select-none" id="cat_${data.name}_close"> close </span>
  </div>
    `
};