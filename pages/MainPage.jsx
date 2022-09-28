import { useRef, useState } from "react";
import styled from "styled-components";

const MainPage = () => {
  const [settings, setSettings] = useState({
    width: 89,
    type: "dotart",
  });
  const editorRef = useRef(null);
  const [edit, setEdit] = useState(false);

  const SelectFile = (e) => {
    console.log(settings.type);
    const files = e.target.files[0];
    if (settings.type === "dotart") {
    } else if (settings.type == "blackAndWhite") {
      setEdit(true);
      insertContent(files);
    }
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
        <TypeSelect name="도트 아트" onChange={(e) => typeChange(e)}>
          <option value="dotart">도트 아트</option>
          <option value="blackAndWhite">흑백</option>
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
        <ContentEdit contentEditable={edit} ref={editorRef}></ContentEdit>
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
