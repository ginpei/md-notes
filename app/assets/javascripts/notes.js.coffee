# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
NS = window

jQuery ($) ->
  $('.note-body').each (index, nBody) ->
    compileNote $(nBody)

compileNote = ($body) ->
  source = $body.find('.note-body-source').val()
  if source
    html = removeScripts(Markdown(extendPre(source)))
    $body.html html

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
