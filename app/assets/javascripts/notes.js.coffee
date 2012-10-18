NS = window

jQuery ($) ->
  $('.note-body').each (index, nBody) ->
    $body = $(nBody)
    compileNote $body.find('.note-body-source'), $body
  $('#note-form .toggle-body > li > a').click (event) ->
    event.preventDefault()
    $link = $(this)
    $form = $link.closest('form')
    id = $link.attr('href').slice(1)
    if id == 'viewer'
      updatePreview $form
    toggleFormBody $form, id

compileNote = ($input, $output) ->
  console.log($input, $output)
  source = $input.val()
  if source
    html = removeScripts(Markdown(extendPre(source)))
    $output.html html

extendPre = (source) ->
  source
    .replace(/~~~~\n((?:.|\s)*?)\n~~~~/g, (m0, m1) ->
      '<pre>' + m1.replace(/</g, '&lt;') + '</pre>'
    )

removeScripts = (source) ->
  source
    .replace(/<script/ig, '&lt;script')
    .replace(/<\/script/ig, '&lt;/script')
    .replace(/\son/ig, ' on&zwnj;')

toggleFormBody = ($form, id) ->
  $form.find('.note-form-body, .toggle-body > li').removeClass 'active'
  $form.find('#' + id).addClass 'active'
  $form.find('a[href="#' + id + '"]').parent().addClass 'active'

updatePreview = ($form) ->
  compileNote $form.find('textarea.note-form-body'), $form.find('div.note-form-body')
