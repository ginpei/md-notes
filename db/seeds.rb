admin = User.create do |u|
  u.account = 'ginpei_jp'
  u.image_url = 'http://a0.twimg.com/profile_images/2229148405/ginpen2_normal.png'
  u.provider = 'twitter'
  u.provider_uid = '68164583'
end

# User.create do |u|
#   u.account = 'ginpei_001'
#   u.image_url = 'http://a0.twimg.com/sticky/default_profile_images/default_profile_0_normal.png'
#   u.provider = 'twitter'
#   u.provider_uid = '786529345'
# end

Note.create do |n|
  n.user = admin
  n.subject = ''
  n.visibility = 2
  n.syntax = 0

  n.body = '# About

...'
end

Note.create do |n|
  n.user = admin
  n.subject = ''
  n.visibility = 2
  n.syntax = 0

  n.body = '# Heading

This is a paragraph.

 * list
 * list
   * nested
 * list

 1. ordered
 2. ordered
 3. ordered

[Link to google.com](http://google.com)

Text with <span style="color:red">HTML tags &amp; special chars</span>.

<div>
Text inside `div` tags.
</div>
~~~~
<div>
Text inside `div` tags.
</div>
~~~~

AAA|BBB|CCC
---|---|---
aaa|bbb|ccc
aaa|bbb|ccc
aaa|bbb|ccc

<hr>

<script>
alert(\'Hello world!\');
</script>

<button onclick="alert(\'Hello world!\');">I have `onclick="..."`, hehe.</button>

~~~~
<script>
alert(\'Hello world!\');
</script>
~~~~'
end
