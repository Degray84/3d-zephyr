export default (data) => {
  return `
    <div class="file_container flex" id="${data.name}-container">
      <label style="background:${data.randomColor}" class="rounded-l flex justify-center items-center h-8 ls:h-10 w-8 ls:w-10 px-4 bg-white border tracking-wide uppercase cursor-pointer ease-linear">
        <input type="color" class="color hidden" id="${data.name}-color" value="#666666">
      </label>
      <input type="name" disabled class="w-full px-2 rounded-r" id="${data.name}-name" value="${data.name}">
      <div id="${data.name}-close" class="h-8 ls:h-10 w-8 ls:w-10 flex justify-center items-center cursor-pointer transition text-gray-600 hover:text-gray-200"><span class="material-icons">close</span></div>
    </div>
    `;
};
