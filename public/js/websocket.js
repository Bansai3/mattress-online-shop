const socket = io(`https://mattress-online-shop.onrender.com`);
socket.on('connect', () => {});

socket.on('mattress_change_notification', (dto) => {
  handleUpdateDto(dto);
});

function handleUpdateDto(dto) {
  if (dto.field === 'cost') {
    toastr.info(`Mattress with id ${dto.id} now costs ${dto.new_value}!`);
  } else if (dto.field === 'status') {
    toastr.warning(`Mattress with id ${dto.id} is sold!`);
  }
}
