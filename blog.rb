require 'sinatra'
require 'sinatra/reloader' if development?
require 'tilt/erubis'
require 'redcarpet'

def render_markdown(content)
  renderer = Redcarpet::Render::HTML.new(:fenced_code_blocks => true, :tables => true)
  markdown = Redcarpet::Markdown.new(renderer, :fenced_code_blocks => true, :tables => true)
  markdown.render(content)
end

def latest_post
  
end

configure do
  enable :reloader
end

not_found do
  @content = File.read("./public/data/files/404_error.md")
  erb :markdown
end

get '/' do
  redirect 'markdown/js_recursion'
end

get '/markdown/:post_id' do
  post_id = params[:post_id]
  @content = File.read("./public/data/files/#{post_id}.md")
  erb :markdown
end
