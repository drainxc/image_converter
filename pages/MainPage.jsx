import { useRef, useState } from "react";
import styled from "styled-components";

const MainPage = () => {
  const [settings, setSettings] = useState({
    width: 89,
    type: "blackAndWhite",
  });
  const editorRef = useRef(null);
  const [edit, setEdit] = useState(false);

  const SelectFile = (e) => {
    console.log(settings.type);
    const files = e.target.files[0];
    if (settings.type === "dotart") {
      loadNewImage(URL.createObjectURL(files));
    } else if (settings.type == "blackAndWhite") {
      setEdit(true);
      insertContent(files);
    } else if (settings.type == "colorReversal") {
      setEdit(true);
      insertContent(files);
    } else if (settings.type == "reversal") {
      setEdit(true);
      insertContent(files);
    }
  };

  async function loadNewImage(src) {
    const canvas = await createImageCanvas(src);
    const text = canvasToText(canvas);
    editorRef.current.innerHTML = text;
  }

  const createImageCanvas = (src) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("CANVAS");
      const image = new Image();

      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (image.width != settings.width * 2) {
          width = settings.width * 2;
          height = (width * image.height) / image.width;
        }

        canvas.width = width - (width % 2);
        canvas.height = height - (height % 4);

        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      };

      image.src = src;
    });
  };

  const pixelsToCharacter = (pixels_lo_hi) => {
    const shift_values = [0, 1, 2, 6, 3, 4, 5, 7];
    let codepoint_offset = 0;
    for (const i in pixels_lo_hi) {
      codepoint_offset += pixels_lo_hi[i] << shift_values[i];
    }

    if (codepoint_offset === 0) {
      codepoint_offset = 4;
    }
    return String.fromCharCode(0x2800 + codepoint_offset);
  };

  const canvasToText = (canvas) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let image_data = new Uint8Array(
      ctx.getImageData(0, 0, width, height).data.buffer
    );

    let output = "";

    for (let imgy = 0; imgy < height; imgy += 4) {
      for (let imgx = 0; imgx < width; imgx += 2) {
        const braille_info = [];
        let idx = 0;
        for (let pos = 0; pos < 8; pos++) {
          const index =
            (imgx + parseInt(pos / 4) + width * (imgy + (pos % 4))) * 4;
          const pixel_data = image_data.slice(index, index + 4);
          if (pixel_data[3] >= 128) {
            const grey =
              0.22 * pixel_data[0] +
              0.72 * pixel_data[1] +
              0.06 * pixel_data[2];

            if (grey <= 128) braille_info[idx] = 1;
          }
          idx++;
        }
        output += pixelsToCharacter(braille_info);
      }
      output += "\n";
    }
    return output;
  };

  const insertContent = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", function (e) {
      editorRef.current.focus();
      document.execCommand("insertImage", false, `${reader.result}`);
      setEdit(false);
    });
    reader.readAsDataURL(file);
  };

  const typeChange = (e) => {
    setSettings({ ...settings, type: e.target.value });
  };

  return (
    <MainDiv>
      <SideBar>
        <FileLabel for="file" id="filelabel">
          이미지 선택
        </FileLabel>
        <FileInput
          id="file"
          type="file"
          accept="image/*"
          onChange={(e) => SelectFile(e)}
        />
        <TypeSelect name="흑백" onChange={(e) => typeChange(e)}>
          <option value="blackAndWhite">흑백</option>
          <option value="dotart">도트 아트</option>
          <option value="colorReversal">색상반전</option>
          <option value="reversal">반전</option>
          <option value="clmtrackr">clmtrackr</option>
          <option value="blur">가우시안 블러</option>
          <option value="mosaic">모자이크</option>
        </TypeSelect>
        <SaveBtn>저장</SaveBtn>
        <SaveBtn>삭제</SaveBtn>
        <Original>
          <img src="" alt="" />
        </Original>
      </SideBar>
      <Content>
        <ContentEdit
          contentEditable={edit}
          ref={editorRef}
          blackAndWhite={settings.type === "blackAndWhite"}
          colorReversal={settings.type === "colorReversal"}
          reversal={settings.type === "reversal"}
        ></ContentEdit>
      </Content>
    </MainDiv>
  );
};
export default MainPage;

const MainDiv = styled.div`
  display: flex;
`;

const ContentEdit = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: ${(props) =>
      props.blackAndWhite ? "grayscale(1)" : "grayscale(0)"};
    filter: ${(props) => (props.colorReversal ? "invert(1)" : "invert(0)")};
    transform: ${(props) => (props.reversal ? "scale(-1,1)" : "scale(1,1)")};
  }
`;

const Content = styled.p`
  overflow: hidden;
  overflow: scroll;
  overflow-x: hidden;
  width: 78vw;
  height: 100vh;
  padding: 30px;
  div {
    width: 100%;
    height: 100%;
    color: white;
  }
`;

const SideBar = styled.div`
  width: 25vw;
  height: 100vh;
  border-right: 1px solid var(--main-color);
  position: relative;
  margin-left: 1.5rem;
`;

const Original = styled.div`
  position: absolute;
  width: 22vw;
  height: 25vh;
  bottom: 100px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const FileInput = styled.input`
  color: var(--sub-color);
  position: absolute;
  z-index: 1;
  opacity: 0;
  overflow: hidden;
  top: 0;
`;

const FileLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  width: 150px;
  height: 65px;
  border-radius: 4px;

  color: #000;
  background-color: var(--box-color);
  color: var(--sub-color);
  font-size: 20px;
  font-weight: 900;
  transition: all 0.2s ease;
  z-index: 0;
  cursor: pointer;

  &:hover {
    transform: translate3d(0, 10%, 0);
  }

  &:active {
    transform: translate3d(0, 20%, 0);
  }
`;

const TypeSelect = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 150px;
  height: 65px;
  margin-top: 15px;
  appearance: none;
  outline: none;
  border: none;
  font-weight: 900;
  font-size: 20px;

  background-color: var(--box-color);
  color: var(--sub-color);
  box-sizing: border-box;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;

  option {
    background-color: var(--box-color);
    color: var(--sub-color);
    box-sizing: border-box;
    cursor: pointer;
  }
`;

const SaveBtn = styled.div`
  width: 150px;
  height: 65px;
  background-color: var(--box-color);
  color: var(--sub-color);
  cursor: pointer;
  margin-top: 15px;
  font-size: 20px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
`;
