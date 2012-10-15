module ApplicationHelper
  def global_header_item(title, contents)
    html = '<div class="item">'
    html += '<div class="subject">'
    html += title
    html += '</div>'
    html += '<ul class="content">'
    contents.each do |content|
      html += '<li>'
      html += link_to(content[:label], content[:url])
      html += '</li>'
    end
    html += '</ul>'
    html += '</div>'

    html.html_safe
  end
end
