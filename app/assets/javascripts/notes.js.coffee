# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
NS = window

jQuery ($) ->
	$('.note-body').each (index, nBody) ->
		compileNote $(nBody)

compileNote = ($body) ->
	$body.html Markdown($body.find('.note-body-source').val())
