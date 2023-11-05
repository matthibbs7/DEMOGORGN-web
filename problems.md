# Issue installing matplotlib  

It appears that matplotlib requires Pillow which requires header/library files for zlib 

I think this can be solved by installing zlib-devel package on the servers

```
(venv) [emackie@pubweb2 demogorgn]$ python3 -m pip install matplotlib
Collecting matplotlib
  Using cached https://files.pythonhosted.org/packages/09/03/b7b30fa81cb687d1178e085d0f01111ceaea3bf81f9330c937fb6f6c8ca0/matplotlib-3.3.4-cp36-cp36m-manylinux1_x86_64.whl
Requirement already satisfied: pyparsing!=2.0.4,!=2.1.2,!=2.1.6,>=2.0.3 in ./venv/lib/python3.6/site-packages (from matplotlib)
Collecting pillow>=6.2.0 (from matplotlib)
  Using cached https://files.pythonhosted.org/packages/7d/2a/2fc11b54e2742db06297f7fa7f420a0e3069fdcf0e4b57dfec33f0b08622/Pillow-8.4.0.tar.gz
Requirement already satisfied: numpy>=1.15 in ./venv/lib/python3.6/site-packages (from matplotlib)
Collecting cycler>=0.10 (from matplotlib)
  Using cached https://files.pythonhosted.org/packages/5c/f9/695d6bedebd747e5eb0fe8fad57b72fdf25411273a39791cde838d5a8f51/cycler-0.11.0-py3-none-any.whl
Requirement already satisfied: python-dateutil>=2.1 in ./venv/lib/python3.6/site-packages (from matplotlib)
Collecting kiwisolver>=1.0.1 (from matplotlib)
  Using cached https://files.pythonhosted.org/packages/a7/1b/cbd8ae738719b5f41592a12057ef5442e2ed5f5cb5451f8fc7e9f8875a1a/kiwisolver-1.3.1-cp36-cp36m-manylinux1_x86_64.whl
Requirement already satisfied: six>=1.5 in ./venv/lib/python3.6/site-packages (from python-dateutil>=2.1->matplotlib)
Installing collected packages: pillow, cycler, kiwisolver, matplotlib
  Running setup.py install for pillow ... error
    Complete output from command /pubapps/emackie/demogorgn/venv/bin/python3 -u -c "import setuptools, tokenize;__file__='/tmp/pip-build-r9rsm0ol/pillow/setup.py';f=getattr(tokenize, 'open', open)(__file__);code=f.read().replace('\r\n', '\n');f.close();exec(compile(code, __file__, 'exec'))" install --record /tmp/pip-l49v1r_4-record/install-record.txt --single-version-externally-managed --compile --install-headers /pubapps/emackie/demogorgn/venv/include/site/python3.6/pillow:
    running install
    running build
    running build_py
    creating build
    creating build/lib.linux-x86_64-3.6
    creating build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/BdfFontFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/IcoImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PyAccess.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/IptcImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/__init__.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/IcnsImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/CurImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GimpGradientFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/BlpImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/BmpImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PaletteFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageMath.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageOps.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/FitsStubImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/Image.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageDraw2.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImtImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageCms.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageFont.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/EpsImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/JpegImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ExifTags.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageChops.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/WalImageFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageFilter.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/TgaImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GimpPaletteFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/WmfImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/Jpeg2KImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageMorph.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PcfFontFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImagePath.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GifImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/SgiImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PsdImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PngImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PdfParser.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/BufrStubImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/_binary.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PcxImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImagePalette.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/TarIO.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ContainerIO.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GdImageFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/XVThumbImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageTransform.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/FtexImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/MicImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PcdImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GbrImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/DcxImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/_tkinter_finder.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/McIdasImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/_version.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/TiffTags.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/MspImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/GribStubImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/Hdf5StubImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageEnhance.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PixarImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageStat.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/TiffImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/MpegImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageTk.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/WebPImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageShow.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/SpiderImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/DdsImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/_util.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageGrab.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/MpoImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageColor.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/JpegPresets.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageSequence.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/__main__.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PpmImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageWin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/SunImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/XbmImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/FontFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/FliImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageFile.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/XpmImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PSDraw.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/FpxImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PdfImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageDraw.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageQt.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/features.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/ImageMode.py -> build/lib.linux-x86_64-3.6/PIL
    copying src/PIL/PalmImagePlugin.py -> build/lib.linux-x86_64-3.6/PIL
    running egg_info
    writing src/Pillow.egg-info/PKG-INFO
    writing dependency_links to src/Pillow.egg-info/dependency_links.txt
    writing top-level names to src/Pillow.egg-info/top_level.txt
    reading manifest file 'src/Pillow.egg-info/SOURCES.txt'
    reading manifest template 'MANIFEST.in'
    warning: no files found matching '*.c'
    warning: no files found matching '*.h'
    warning: no files found matching '*.sh'
    warning: no previously-included files found matching '.appveyor.yml'
    warning: no previously-included files found matching '.clang-format'
    warning: no previously-included files found matching '.coveragerc'
    warning: no previously-included files found matching '.editorconfig'
    warning: no previously-included files found matching '.readthedocs.yml'
    warning: no previously-included files found matching 'codecov.yml'
    warning: no previously-included files matching '.git*' found anywhere in distribution
    warning: no previously-included files matching '*.pyc' found anywhere in distribution
    warning: no previously-included files matching '*.so' found anywhere in distribution
    no previously-included directories found matching '.ci'
    writing manifest file 'src/Pillow.egg-info/SOURCES.txt'
    running build_ext


    The headers or library files could not be found for zlib,
    a required dependency when compiling Pillow from source.

    Please see the install instructions at:
       https://pillow.readthedocs.io/en/latest/installation.html

    Traceback (most recent call last):
      File "/tmp/pip-build-r9rsm0ol/pillow/setup.py", line 1024, in <module>
        zip_safe=not (debug_build() or PLATFORM_MINGW),
      File "/pubapps/emackie/demogorgn/venv/lib64/python3.6/site-packages/setuptools/__init__.py", line 129, in setup
        return distutils.core.setup(**attrs)
      File "/usr/lib64/python3.6/distutils/core.py", line 148, in setup
        dist.run_commands()
      File "/usr/lib64/python3.6/distutils/dist.py", line 955, in run_commands
        self.run_command(cmd)
      File "/usr/lib64/python3.6/distutils/dist.py", line 974, in run_command
        cmd_obj.run()
      File "/pubapps/emackie/demogorgn/venv/lib64/python3.6/site-packages/setuptools/command/install.py", line 61, in run
        return orig.install.run(self)
      File "/usr/lib64/python3.6/distutils/command/install.py", line 556, in run
        self.run_command('build')
      File "/usr/lib64/python3.6/distutils/cmd.py", line 313, in run_command
        self.distribution.run_command(command)
      File "/usr/lib64/python3.6/distutils/dist.py", line 974, in run_command
        cmd_obj.run()
      File "/usr/lib64/python3.6/distutils/command/build.py", line 135, in run
        self.run_command(cmd_name)
      File "/usr/lib64/python3.6/distutils/cmd.py", line 313, in run_command
        self.distribution.run_command(command)
      File "/usr/lib64/python3.6/distutils/dist.py", line 974, in run_command
        cmd_obj.run()
      File "/pubapps/emackie/demogorgn/venv/lib64/python3.6/site-packages/setuptools/command/build_ext.py", line 78, in run
        _build_ext.run(self)
      File "/usr/lib64/python3.6/distutils/command/build_ext.py", line 339, in run
        self.build_extensions()
      File "/tmp/pip-build-r9rsm0ol/pillow/setup.py", line 790, in build_extensions
        raise RequiredDependencyException(f)
    __main__.RequiredDependencyException: zlib

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/tmp/pip-build-r9rsm0ol/pillow/setup.py", line 1037, in <module>
        raise RequiredDependencyException(msg)
    __main__.RequiredDependencyException:

    The headers or library files could not be found for zlib,
    a required dependency when compiling Pillow from source.

    Please see the install instructions at:
       https://pillow.readthedocs.io/en/latest/installation.html



    ----------------------------------------
Command "/pubapps/emackie/demogorgn/venv/bin/python3 -u -c "import setuptools, tokenize;__file__='/tmp/pip-build-r9rsm0ol/pillow/setup.py';f=getattr(tokenize, 'open', open)(__file__);code=f.read().replace('\r\n', '\n');f.close();exec(compile(code, __file__, 'exec'))" install --record /tmp/pip-l49v1r_4-record/install-record.txt --single-version-externally-managed --compile --install-headers /pubapps/emackie/demogorgn/venv/include/site/python3.6/pillow" failed with error code 1 in /tmp/pip-build-r9rsm0ol/pillow/
You are using pip version 9.0.3, however version 23.3.1 is available.
You should consider upgrading via the 'pip install --upgrade pip' command.
```