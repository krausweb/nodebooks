'use strict';

(function ($) {

	class Item {

		_prependToList(items = {}) {
			let content = $.templates("#tdBookTmpl").render( {
				name: items.name, author: items.author, bookCreated: items.bookCreated, numHash: items.numHash
			});
			$('.book-list tbody').prepend(content);
		}

		itemAdd() {
			$('form.book-add').on('submit', (e) => {
				let form = $(e.currentTarget),
					itemData = form.serialize(),
					newItem = {
							name: $(form).find('input[name=name]').val(),
							author: $(form).find('input[name=author]').val(),
							bookCreated: $(form).find('input[name=bookCreated]').val()
						};

				e.preventDefault();
				$('.alert-danger, .alert-success').hide();

				$.ajax({
					type: 'PUT', url: '/book', data: itemData
				}).done( (resNumHash) => {
					newItem.numHash = resNumHash;
					this._prependToList(newItem);
					form.trigger('reset');
					$('.alert-success').show().fadeOut(5000);
				}).fail( (jqXHR, textStatus, errorThrown) => {
					if (errorThrown) throw new Error(errorThrown);
					$('.alert-danger').show().fadeOut(5000);
				});
			});
		}

		itemUpdate() {
			$('form.book-update').on('submit', (e) => {
				let form = $(e.currentTarget),
					itemData = form.serialize(),
					itemName = $(form).find('input[name=name]').val(),
					itemNumHash = $(form).find('input[name=numHash]').val();

				$('#book-name-nav, #book-name-h1').text(itemName);
				e.preventDefault();
				$('.alert-danger, .alert-success').hide();

				$.ajax({
					type: 'POST', url: '/book/'+ itemNumHash, data: itemData
				}).done( () => {
					$('.alert-success').show().fadeOut(5000);
				}).fail( (jqXHR, textStatus, errorThrown) => {
					if (errorThrown) throw new Error(errorThrown);
					$('.alert-danger').show().fadeOut(5000);
				});
			});
		}

		itemDelete() {
			$('.book-list').on('click', 'a[data-delete]', (e) => {
				let target = $(e.currentTarget);

				e.preventDefault();
				if (!confirm('Are you sure ?')) return false;

				$.ajax({
					type: 'DELETE', url: '/book/' + target.data('delete')
				}).done( () => {
					target.parents('tr').remove();
				}).fail( (jqXHR, textStatus, errorThrown) => {
					if (errorThrown) throw new Error(errorThrown);
				});
			});
		}
	}

	let book = new Item();
	book.itemAdd();
	book.itemDelete();
	book.itemUpdate();

	$('body').bootstrapMaterialDesign();

}(jQuery || {}));