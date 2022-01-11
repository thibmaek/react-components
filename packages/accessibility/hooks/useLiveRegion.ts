export default function useiOSLiveRegion(mutableValue: any): RefObject<any> {
  const [mode] = useAppMode();
  const [ref, setFocus] = useAccessibilityFocus();

  useEffect(() => {
    if (mode === "accessible") {
      setFocus();
    }
  }, [mutableValue]);

  return ref;
}
