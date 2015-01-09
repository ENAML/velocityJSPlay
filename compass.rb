require 'breakpoint'

preferred_syntax = :scss
css_dir = 'app/css'
sass_dir = 'app/css/scss'
images_dir = 'app/img'

# Copy sprite without hash
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end
 
# Replace sprite calls into files
on_stylesheet_saved do |filename|
  if File.exists?(filename)
    css = File.read filename
    File.open(filename, 'w+') do |f|
      f << css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png')
    end
  end
end