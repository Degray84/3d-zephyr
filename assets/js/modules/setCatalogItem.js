export default (data) => {
	return `
		<div class="relative md:w-1/2 p-3 w-full ">
			<div class="flex bg-gradient-to-r  from-purple-200 to-white rounded shadow-md">
				<div class="block relative flex-shrink-0 h-48 w-48 lg:h-60 lg:w-60 rounded overflow-hidden">
					<div class="absolute top-4 right-2 cursor-pointer view_3d" data-target="${data.name}" id="${data.name}_view">
						<span class="material-icons"> 3d_rotation </span>
					</div>
					<img alt="ecommerce" class="object-cover object-center w-full h-full block"
					src=${data.preview}>
				</div>
				<div class="mt-2 flex-grow flex flex-col p-2">
					<h3 class="text-gray-500 tracking-widest title-font mb-1">${data.purpose}</h3>
					<h2 class="text-gray-900 title-font text-lg font-medium">${data.name}</h2>
					<div class="h-0.5 w-full bg-gradient-to-r from-transparent to-purple-200"></div>
					<div class="absolute text-xl font-bold bottom-2 right-2 py-2 px-4 rounded-lg shadow-md bg-gradient-to-br from-white to-yellow-200 text-gray-600 z-1">${data.price} р.</div>
					<div class="card__categories overflow-auto inline-flex space-x-1 my-2 ">${data.categories.reduce((acc,elem) => acc + `<div class="card__category bg-purple-200 py-0.5 px-2 rounded">${elem}</div>`,'')}</div> 
					<div class="h-0.5 w-full bg-gradient-to-r from-transparent to-purple-200"></div>
					<div class="spec flex ">
						<div class="card_dimensions flex flex-col my-1 w-1/2">
							<div class="card_length  text-md">
								<span>Длина: </span><span class="">${data.length}</span><span class="text-xs"> мм</span>
							</div>
							<div class="card_length text-md">
								<span>Ширина: </span><span>${data.width}</span><span class="text-xs"> мм</span>
							</div>
							<div class="card_length text-md">
								<span>Высота: </span><span>${data.height}</span><span class="text-xs"> мм</span>
							</div>
							<div class="card_length flex items-center text-md mt-1">

								<span class="uppercase pr-0.5">Масса: </span><span class="px-1 font-bold text-lg">${data.mass}</span><span class="text-xs"> гр</span>
							</div>
						</div>
						<div class="mass w-1/2 flex items-center justify-center">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
};