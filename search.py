#-*-encoding: utf-8 -*-
import os, time, fnmatch, codecs

content_extract = 32
max_cutouts = 20 

class Item:
    def __init__(self, prefix, suffix):
        self.prefix = prefix
        self.suffix = suffix
        
class Search:
    def __init__(self, path, search_string, file_filter):
        self.search_path = path
        self.search_string = search_string
        self.file_filter = file_filter
        time_begin = time.time()
 
    def walk(self):
        file_count = 0
        ret = []
        for root, dirlist, filelist in os.walk(self.search_path, followlinks=True):
            for filename in filelist:
                if not filename.startswith("."):
                    for file_filter in self.file_filter:
                        if fnmatch.fnmatch(filename, file_filter):
                            result = self.search_file(os.path.join(root, filename))
                            ret.append(result)
                            file_count += 1

        return ret
 
    def search_file(self, filepath):
        f = codecs.open(filepath, mode="r", encoding="utf-8")
        content = f.read()
        f.close()

        contents = None
        if self.search_string in content:
            contents = self.cutout_content(content)
            
        return [filepath, contents]

        return None
    def cutout_content(self, content):
        current_pos = 0
        search_string_len = len(self.search_string)

        ret = []
        for i in xrange(max_cutouts):
            try:
                pos = content.index(self.search_string, current_pos)
            except ValueError, e:
                break

            prefix = content[pos - content_extract : pos]
            suffix = content[pos + search_string_len : pos + search_string_len + content_extract]
            ret.append(Item(prefix, suffix))
            current_pos += pos + search_string_len

        return ret
