#!/usr/bin/env ruby
require "json"

baseline_path = File.join(__dir__, "url-baseline.json")
current_path = ARGV[0] || "_site/urls.json"

unless File.exist?(baseline_path)
  warn "Baseline mancante: #{baseline_path}"
  exit 1
end

unless File.exist?(current_path)
  warn "File corrente mancante: #{current_path}"
  exit 1
end

baseline = JSON.parse(File.read(baseline_path))
current = JSON.parse(File.read(current_path))

current_by_file = current.each_with_object({}) do |entry, result|
  result[entry["file"]] = entry["url"]
end

errors = []

baseline.each do |entry|
  file = entry["file"]
  old_url = entry["url"]

  unless current_by_file.key?(file)
    errors << "Post mancante: #{file} (prima: #{old_url})"
    next
  end

  next if current_by_file[file] == old_url

  errors << "URL cambiato: #{file}\n  prima: #{old_url}\n  ora:   #{current_by_file[file]}"
end

if errors.any?
  warn "Controllo URL fallito:\n"
  errors.each { |error| warn "  #{error}" }
  warn "\nSe il cambio è voluto, aggiorna scripts/url-baseline.json e aggiungi un redirect."
  exit 1
end

baseline_files = baseline.map { |entry| entry["file"] }
new_posts = current_by_file.keys - baseline_files

puts "URL baseline OK (#{baseline.size} post, #{new_posts.size} nuovi)"
